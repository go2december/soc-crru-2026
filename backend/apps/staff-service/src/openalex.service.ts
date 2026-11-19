import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService, staffProfiles, staffPublications } from 'db/database';
import { eq, isNotNull, or } from 'drizzle-orm';

interface OpenAlexAuthorResponse {
  id?: string;
  display_name?: string;
}

interface OpenAlexWork {
  id?: string;
  doi?: string | null;
  title?: string | null;
  publication_year?: number | null;
  publication_date?: string | null;
  type?: string | null;
  cited_by_count?: number | null;
  primary_location?: {
    landing_page_url?: string | null;
    pdf_url?: string | null;
    source?: {
      display_name?: string | null;
    } | null;
  } | null;
  open_access?: {
    is_oa?: boolean;
    oa_url?: string | null;
  } | null;
  authorships?: Array<{
    author?: {
      display_name?: string | null;
    } | null;
  }> | null;
}

interface OpenAlexWorksResponse {
  results?: OpenAlexWork[];
}

export interface OpenAlexSyncResult {
  staffId: string;
  openalexAuthorId: string;
  syncedCount: number;
  syncedAt: Date;
}

@Injectable()
export class OpenAlexService {
  private readonly logger = new Logger(OpenAlexService.name);
  private readonly baseUrl = 'https://api.openalex.org';

  constructor(private readonly drizzle: DatabaseService) {}

  private get mailto(): string {
    return process.env.OPENALEX_MAILTO || 'soc@crru.ac.th';
  }

  normalizeOrcid(raw?: string | null): string | null {
    if (!raw) return null;
    const cleaned = raw
      .trim()
      .replace(/^https?:\/\/(www\.)?orcid\.org\//i, '')
      .replace(/\/+$/, '');
    return cleaned || null;
  }

  normalizeOpenAlexId(raw?: string | null): string | null {
    if (!raw) return null;
    const cleaned = raw
      .trim()
      .replace(/^https?:\/\/(www\.)?openalex\.org\//i, '')
      .replace(/\/+$/, '');
    if (!cleaned) return null;
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }

  normalizeDoi(raw?: string | null): string | null {
    if (!raw) return null;
    const cleaned = raw
      .trim()
      .replace(/^https?:\/\/(dx\.)?doi\.org\//i, '')
      .toLowerCase();
    return cleaned || null;
  }

  private async fetchJson<T>(url: string): Promise<T | null> {
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
    });
    if (res.status === 404) return null;
    if (!res.ok) {
      throw new Error(`OpenAlex API error: ${res.status} ${res.statusText}`);
    }
    return (await res.json()) as T;
  }

  async resolveAuthorId(
    orcidId?: string | null,
    existingAuthorId?: string | null,
  ): Promise<string> {
    const normalizedExisting = this.normalizeOpenAlexId(existingAuthorId);
    if (normalizedExisting) return normalizedExisting;

    const orcid = this.normalizeOrcid(orcidId);
    if (!orcid) {
      throw new BadRequestException(
        'Staff member has no ORCID ID or OpenAlex Author ID',
      );
    }

    const url = `${this.baseUrl}/authors/https://orcid.org/${encodeURIComponent(orcid)}?mailto=${encodeURIComponent(this.mailto)}`;
    const author = await this.fetchJson<OpenAlexAuthorResponse>(url);
    const resolvedId = this.normalizeOpenAlexId(author?.id);
    if (!resolvedId) {
      throw new NotFoundException(
        `Author not found in OpenAlex for ORCID ${orcid}`,
      );
    }
    return resolvedId;
  }

  async syncStaffById(staffId: string): Promise<OpenAlexSyncResult> {
    const rows = await this.drizzle.db
      .select({
        id: staffProfiles.id,
        orcidId: staffProfiles.orcidId,
        openalexAuthorId: staffProfiles.openalexAuthorId,
      })
      .from(staffProfiles)
      .where(eq(staffProfiles.id, staffId));

    if (rows.length === 0) {
      throw new NotFoundException(`Staff profile with ID ${staffId} not found`);
    }

    const staff = rows[0];
    const authorId = await this.resolveAuthorId(
      staff.orcidId,
      staff.openalexAuthorId,
    );

    const selectFields = [
      'id',
      'doi',
      'title',
      'publication_year',
      'publication_date',
      'primary_location',
      'type',
      'cited_by_count',
      'open_access',
      'authorships',
    ].join(',');

    const worksUrl = `${this.baseUrl}/works?filter=author.id:${encodeURIComponent(authorId)}&sort=publication_year:desc&per-page=100&select=${selectFields}&mailto=${encodeURIComponent(this.mailto)}`;
    const worksPayload = await this.fetchJson<OpenAlexWorksResponse>(worksUrl);
    const rawWorks = worksPayload?.results ?? [];

    const seenWorkIds = new Set<string>();
    const seenDois = new Set<string>();
    const syncedAt = new Date();
    let syncedCount = 0;

    for (const work of rawWorks) {
      const workId = this.normalizeOpenAlexId(work.id);
      const title = work.title?.trim();
      if (!workId || !title || seenWorkIds.has(workId)) continue;

      const doi = this.normalizeDoi(work.doi);
      if (doi && seenDois.has(doi)) continue;

      seenWorkIds.add(workId);
      if (doi) seenDois.add(doi);

      const authors = (work.authorships ?? [])
        .map((a) => a.author?.display_name?.trim())
        .filter((name): name is string => Boolean(name))
        .slice(0, 10);

      const oaUrl =
        work.open_access?.oa_url ||
        work.primary_location?.pdf_url ||
        work.primary_location?.landing_page_url ||
        null;

      const record = {
        staffProfileId: staffId,
        openalexWorkId: workId,
        doi,
        title,
        publicationYear: work.publication_year ?? null,
        publicationDate: work.publication_date ?? null,
        journalName: work.primary_location?.source?.display_name?.trim() || null,
        type: work.type ?? null,
        citedByCount: work.cited_by_count ?? 0,
        isOa: Boolean(work.open_access?.is_oa),
        oaUrl,
        authors,
        syncedAt,
      };

      await this.drizzle.db
        .insert(staffPublications)
        .values(record)
        .onConflictDoUpdate({
          target: [
            staffPublications.staffProfileId,
            staffPublications.openalexWorkId,
          ],
          set: {
            doi: record.doi,
            title: record.title,
            publicationYear: record.publicationYear,
            publicationDate: record.publicationDate,
            journalName: record.journalName,
            type: record.type,
            citedByCount: record.citedByCount,
            isOa: record.isOa,
            oaUrl: record.oaUrl,
            authors: record.authors,
            syncedAt: record.syncedAt,
          },
        });

      syncedCount += 1;
    }

    await this.drizzle.db
      .update(staffProfiles)
      .set({
        openalexAuthorId: authorId,
        openalexSyncedAt: syncedAt,
      })
      .where(eq(staffProfiles.id, staffId));

    return {
      staffId,
      openalexAuthorId: authorId,
      syncedCount,
      syncedAt,
    };
  }

  async syncAllStaff() {
    const eligible = await this.drizzle.db
      .select({
        id: staffProfiles.id,
        firstNameTh: staffProfiles.firstNameTh,
        lastNameTh: staffProfiles.lastNameTh,
      })
      .from(staffProfiles)
      .where(
        or(
          isNotNull(staffProfiles.orcidId),
          isNotNull(staffProfiles.openalexAuthorId),
        ),
      );

    let succeeded = 0;
    let failed = 0;
    let totalWorksSynced = 0;
    const errors: Array<{ staffId: string; name: string; reason: string }> = [];

    for (const member of eligible) {
      try {
        const res = await this.syncStaffById(member.id);
        succeeded += 1;
        totalWorksSynced += res.syncedCount;
      } catch (err) {
        failed += 1;
        const reason = err instanceof Error ? err.message : 'Unknown error';
        this.logger.warn(
          `OpenAlex sync failed for ${member.firstNameTh} ${member.lastNameTh}: ${reason}`,
        );
        errors.push({
          staffId: member.id,
          name: `${member.firstNameTh} ${member.lastNameTh}`,
          reason,
        });
      }

      // Polite pool spacing between requests
      await new Promise((resolve) => setTimeout(resolve, 150));
    }

    return {
      totalEligible: eligible.length,
      succeeded,
      failed,
      totalWorksSynced,
      errors,
    };
  }
}
