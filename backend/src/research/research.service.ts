import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DrizzleService } from '../drizzle/drizzle.service';
import { UploadService } from '../upload/upload.service';
import {
  projectLocations,
  projectMembers,
  projectSdgs,
  researchAttachments,
  researchOutputs,
  researchProjects,
  staffProfiles,
} from '../drizzle/schema';
import {
  CreateResearchProjectDto,
  CreateProjectLocationDto,
  CreateProjectMemberDto,
  CreateResearchAttachmentDto,
  CreateResearchOutputDto,
} from './dto/create-research-project.dto';
import { UpdateResearchProjectDto } from './dto/update-research-project.dto';
import {
  and,
  asc,
  count,
  desc,
  eq,
  ilike,
  inArray,
  isNotNull,
  sql,
} from 'drizzle-orm';
import slugify from 'slugify';

interface PublicListParams {
  q?: string;
  year?: number;
  status?: string;
  sdg?: number;
  fundingSource?: string;
  isSocialService?: string;
  isCommercial?: string;
  page: number;
  limit: number;
}

interface AdminListParams {
  q?: string;
  year?: number;
  status?: string;
  isPublished?: string;
  isSocialService?: string;
  isCommercial?: string;
  page: number;
  limit: number;
}

@Injectable()
export class ResearchService {
  constructor(
    private readonly drizzle: DrizzleService,
    private readonly uploadService: UploadService,
  ) {}

  private generateSlug(title: string): string {
    return `${slugify(title, { lower: true, strict: true })}-${Date.now().toString().slice(-4)}`;
  }

  private parseBoolean(value?: string): boolean | undefined {
    if (value === undefined) return undefined;
    if (value === 'true') return true;
    if (value === 'false') return false;
    return undefined;
  }

  private ensureProjectMembers(members?: CreateProjectMemberDto[]) {
    for (const member of members ?? []) {
      const hasStaff = Boolean(member.staffProfileId);
      const hasExternal = Boolean(member.externalName?.trim());

      if (!hasStaff && !hasExternal) {
        throw new BadRequestException(
          'Each project member must provide either staffProfileId or externalName',
        );
      }

      if (hasStaff && hasExternal) {
        throw new BadRequestException(
          'Each project member can provide only one of staffProfileId or externalName',
        );
      }
    }
  }

  private async ensureStaffProfilesExist(members?: CreateProjectMemberDto[]) {
    const staffIds = Array.from(
      new Set((members ?? []).map((member) => member.staffProfileId).filter(Boolean)),
    ) as string[];

    if (!staffIds.length) return;

    const existing = await this.drizzle.db
      .select({ id: staffProfiles.id })
      .from(staffProfiles)
      .where(inArray(staffProfiles.id, staffIds));

    const existingIds = new Set(existing.map((item) => item.id));
    const missing = staffIds.filter((id) => !existingIds.has(id));

    if (missing.length) {
      throw new BadRequestException(
        `Staff profile not found for member IDs: ${missing.join(', ')}`,
      );
    }
  }

  private async getProjectMembersByProjectIds(projectIds: string[]) {
    if (!projectIds.length) return [];

    return this.drizzle.db
      .select({
        id: projectMembers.id,
        projectId: projectMembers.projectId,
        staffProfileId: projectMembers.staffProfileId,
        externalName: projectMembers.externalName,
        role: projectMembers.role,
        sortOrder: projectMembers.sortOrder,
        prefixTh: staffProfiles.prefixTh,
        firstNameTh: staffProfiles.firstNameTh,
        lastNameTh: staffProfiles.lastNameTh,
      })
      .from(projectMembers)
      .leftJoin(staffProfiles, eq(projectMembers.staffProfileId, staffProfiles.id))
      .where(inArray(projectMembers.projectId, projectIds))
      .orderBy(asc(projectMembers.sortOrder), asc(projectMembers.id));
  }

  private buildMemberDisplayName(member: {
    externalName?: string | null;
    prefixTh?: string | null;
    firstNameTh?: string | null;
    lastNameTh?: string | null;
  }) {
    if (member.externalName) return member.externalName;
    return [member.prefixTh, member.firstNameTh, member.lastNameTh]
      .filter(Boolean)
      .join(' ')
      .trim();
  }

  private normalizeExistingMembers(members: any[]): CreateProjectMemberDto[] {
    return members.map((member) => ({
      staffProfileId: member.staffProfileId ?? undefined,
      externalName: member.externalName ?? undefined,
      role: member.role,
      sortOrder: member.sortOrder,
    }));
  }

  private async cleanupResearchFile(url?: string | null) {
    if (!url || !url.startsWith('/uploads/research/')) return;
    await this.uploadService.deleteResearchImage(url);
  }

  private normalizeExistingLocations(locations: any[]): CreateProjectLocationDto[] {
    return locations.map((location) => ({
      subDistrict: location.subDistrict ?? undefined,
      district: location.district ?? undefined,
      province: location.province ?? undefined,
      lat: location.lat ?? undefined,
      lng: location.lng ?? undefined,
    }));
  }

  private normalizeExistingOutputs(outputs: any[]): CreateResearchOutputDto[] {
    return outputs.map((output) => ({
      outputType: output.outputType ?? undefined,
      title: output.title,
      journalName: output.journalName ?? undefined,
      publicationDate: output.publicationDate ?? undefined,
      volume: output.volume ?? undefined,
      issue: output.issue ?? undefined,
      pages: output.pages ?? undefined,
      citation: output.citation ?? undefined,
      doiUrl: output.doiUrl ?? undefined,
      tciUrl: output.tciUrl ?? undefined,
      externalUrl: output.externalUrl ?? undefined,
      tier: output.tier ?? undefined,
    }));
  }

  private normalizeExistingAttachments(attachments: any[]): CreateResearchAttachmentDto[] {
    return attachments.map((attachment) => ({
      fileName: attachment.fileName,
      fileType: attachment.fileType ?? undefined,
      fileUrl: attachment.fileUrl,
      downloadCount: attachment.downloadCount,
    }));
  }

  private async enrichProjectsForList(
    projects: Array<{
      id: string;
      slug: string;
      titleTh: string;
      year: number;
      fundingSource: string | null;
      status: string;
      isSocialService: boolean;
      isCommercial: boolean;
      coverImageUrl: string | null;
    }>,
  ) {
    const projectIds = projects.map((project) => project.id);
    const [members, sdgs, attachments, outputs] = await Promise.all([
      this.getProjectMembersByProjectIds(projectIds),
      projectIds.length
        ? this.drizzle.db
            .select({ projectId: projectSdgs.projectId, sdgId: projectSdgs.sdgId })
            .from(projectSdgs)
            .where(inArray(projectSdgs.projectId, projectIds))
        : Promise.resolve([]),
      projectIds.length
        ? this.drizzle.db
            .select({
              projectId: researchAttachments.projectId,
              count: count(researchAttachments.id),
            })
            .from(researchAttachments)
            .where(inArray(researchAttachments.projectId, projectIds))
            .groupBy(researchAttachments.projectId)
        : Promise.resolve([]),
      projectIds.length
        ? this.drizzle.db
            .select({
              projectId: researchOutputs.projectId,
              count: count(researchOutputs.id),
            })
            .from(researchOutputs)
            .where(inArray(researchOutputs.projectId, projectIds))
            .groupBy(researchOutputs.projectId)
        : Promise.resolve([]),
    ]);

    const membersByProject = new Map<string, string[]>();
    for (const member of members) {
      const displayName = this.buildMemberDisplayName(member);
      const current = membersByProject.get(member.projectId) ?? [];
      if (displayName) current.push(displayName);
      membersByProject.set(member.projectId, current);
    }

    const sdgsByProject = new Map<string, number[]>();
    for (const sdg of sdgs) {
      const current = sdgsByProject.get(sdg.projectId) ?? [];
      current.push(sdg.sdgId);
      sdgsByProject.set(sdg.projectId, current);
    }

    const attachmentCountByProject = new Map<string, number>(
      attachments.map((item): [string, number] => [item.projectId, Number(item.count)]),
    );
    const outputCountByProject = new Map<string, number>(
      outputs.map((item): [string, number] => [item.projectId, Number(item.count)]),
    );

    return projects.map((project) => ({
      ...project,
      memberDisplay: membersByProject.get(project.id) ?? [],
      sdgIds: sdgsByProject.get(project.id) ?? [],
      attachmentCount: attachmentCountByProject.get(project.id) ?? 0,
      outputCount: outputCountByProject.get(project.id) ?? 0,
    }));
  }

  private async getProjectDetailByCondition(condition: any) {
    const projects = await this.drizzle.db
      .select()
      .from(researchProjects)
      .where(condition)
      .limit(1);

    if (!projects.length) {
      throw new NotFoundException('Research project not found');
    }

    const project = projects[0];
    const [members, locations, sdgs, outputs, attachments] = await Promise.all([
      this.getProjectMembersByProjectIds([project.id]),
      this.drizzle.db
        .select()
        .from(projectLocations)
        .where(eq(projectLocations.projectId, project.id))
        .orderBy(asc(projectLocations.province), asc(projectLocations.district)),
      this.drizzle.db
        .select({ sdgId: projectSdgs.sdgId })
        .from(projectSdgs)
        .where(eq(projectSdgs.projectId, project.id))
        .orderBy(asc(projectSdgs.sdgId)),
      this.drizzle.db
        .select()
        .from(researchOutputs)
        .where(eq(researchOutputs.projectId, project.id))
        .orderBy(desc(researchOutputs.publicationDate), asc(researchOutputs.id)),
      this.drizzle.db
        .select()
        .from(researchAttachments)
        .where(eq(researchAttachments.projectId, project.id))
        .orderBy(desc(researchAttachments.createdAt), asc(researchAttachments.id)),
    ]);

    return {
      ...project,
      members: members.map((member) => ({
        id: member.id,
        staffProfileId: member.staffProfileId,
        externalName: member.externalName,
        role: member.role,
        sortOrder: member.sortOrder,
        displayName: this.buildMemberDisplayName(member),
      })),
      locations,
      sdgIds: sdgs.map((item) => item.sdgId),
      outputs,
      attachments,
    };
  }

  private async syncNestedCollections(projectId: string, dto: UpdateResearchProjectDto) {
    await this.drizzle.db.delete(projectMembers).where(eq(projectMembers.projectId, projectId));
    await this.drizzle.db.delete(projectLocations).where(eq(projectLocations.projectId, projectId));
    await this.drizzle.db.delete(projectSdgs).where(eq(projectSdgs.projectId, projectId));
    await this.drizzle.db.delete(researchOutputs).where(eq(researchOutputs.projectId, projectId));
    await this.drizzle.db
      .delete(researchAttachments)
      .where(eq(researchAttachments.projectId, projectId));

    if (dto.members?.length) {
      await this.drizzle.db.insert(projectMembers).values(
        dto.members.map((member, index) => ({
          projectId,
          staffProfileId: member.staffProfileId,
          externalName: member.externalName?.trim() || null,
          role: member.role,
          organization: null,
          positionTitle: null,
          sortOrder: member.sortOrder ?? index,
        })),
      );
    }

    if (dto.locations?.length) {
      await this.drizzle.db.insert(projectLocations).values(
        dto.locations.map((location) => ({
          projectId,
          subDistrict: location.subDistrict?.trim() || null,
          district: location.district?.trim() || null,
          province: location.province?.trim() || 'เชียงราย',
          lat: location.lat,
          lng: location.lng,
        })),
      );
    }

    if (dto.sdgIds?.length) {
      await this.drizzle.db.insert(projectSdgs).values(
        Array.from(new Set(dto.sdgIds)).map((sdgId) => ({
          projectId,
          sdgId,
        })),
      );
    }

    if (dto.outputs?.length) {
      await this.drizzle.db.insert(researchOutputs).values(
        dto.outputs.map((output) => ({
          projectId,
          outputType: output.outputType?.trim() || null,
          title: output.title,
          journalName: output.journalName?.trim() || null,
          publicationDate: output.publicationDate ? new Date(output.publicationDate) : null,
          volume: output.volume?.trim() || null,
          issue: output.issue?.trim() || null,
          pages: output.pages?.trim() || null,
          citation: output.citation?.trim() || null,
          doiUrl: output.doiUrl?.trim() || null,
          tciUrl: output.tciUrl?.trim() || null,
          externalUrl: output.externalUrl?.trim() || null,
          tier: output.tier?.trim() || null,
        })),
      );
    }

    if (dto.attachments?.length) {
      await this.drizzle.db.insert(researchAttachments).values(
        dto.attachments.map((attachment) => ({
          projectId,
          fileName: attachment.fileName,
          fileType: attachment.fileType?.trim() || null,
          fileUrl: attachment.fileUrl,
          downloadCount: attachment.downloadCount ?? 0,
        })),
      );
    }
  }

  async findAllPublic(params: PublicListParams) {
    const page = Math.max(params.page || 1, 1);
    const limit = Math.min(Math.max(params.limit || 10, 1), 100);
    const conditions: any[] = [eq(researchProjects.isPublished, true)];

    if (params.q?.trim()) {
      const search = `%${params.q.trim()}%`;
      conditions.push(
        sql`(${researchProjects.titleTh} ILIKE ${search} OR ${researchProjects.titleEn} ILIKE ${search} OR ${researchProjects.abstractTh} ILIKE ${search} OR ${researchProjects.abstractEn} ILIKE ${search})`,
      );
    }
    if (params.year) conditions.push(eq(researchProjects.year, params.year));
    if (params.status) conditions.push(eq(researchProjects.status, params.status as any));
    if (params.fundingSource?.trim()) {
      conditions.push(eq(researchProjects.fundingSource, params.fundingSource.trim()));
    }

    const isSocialService = this.parseBoolean(params.isSocialService);
    const isCommercial = this.parseBoolean(params.isCommercial);
    if (isSocialService !== undefined) {
      conditions.push(eq(researchProjects.isSocialService, isSocialService));
    }
    if (isCommercial !== undefined) {
      conditions.push(eq(researchProjects.isCommercial, isCommercial));
    }

    const whereCondition = conditions.length === 1 ? conditions[0] : and(...conditions);

    let matchedProjectIds: string[] | null = null;
    if (params.sdg) {
      const matches = await this.drizzle.db
        .select({ projectId: projectSdgs.projectId })
        .from(projectSdgs)
        .where(eq(projectSdgs.sdgId, params.sdg));
      matchedProjectIds = matches.map((item) => item.projectId);
      if (!matchedProjectIds.length) {
        return {
          data: [],
          meta: { total: 0, page, limit, totalPages: 0 },
        };
      }
    }

    const finalCondition = matchedProjectIds
      ? and(whereCondition, inArray(researchProjects.id, matchedProjectIds))
      : whereCondition;

    const totalRows = await this.drizzle.db
      .select({ count: count(researchProjects.id) })
      .from(researchProjects)
      .where(finalCondition);

    const projects = await this.drizzle.db
      .select({
        id: researchProjects.id,
        slug: researchProjects.slug,
        titleTh: researchProjects.titleTh,
        year: researchProjects.year,
        fundingSource: researchProjects.fundingSource,
        status: researchProjects.status,
        isSocialService: researchProjects.isSocialService,
        isCommercial: researchProjects.isCommercial,
        coverImageUrl: researchProjects.coverImageUrl,
        publishedAt: researchProjects.publishedAt,
        createdAt: researchProjects.createdAt,
      })
      .from(researchProjects)
      .where(finalCondition)
      .orderBy(desc(researchProjects.year), desc(researchProjects.publishedAt), desc(researchProjects.createdAt))
      .limit(limit)
      .offset((page - 1) * limit);

    return {
      data: await this.enrichProjectsForList(projects),
      meta: {
        total: Number(totalRows[0]?.count ?? 0),
        page,
        limit,
        totalPages: Math.ceil(Number(totalRows[0]?.count ?? 0) / limit),
      },
    };
  }

  async findBySlug(slug: string) {
    return this.getProjectDetailByCondition(
      and(eq(researchProjects.slug, slug), eq(researchProjects.isPublished, true)),
    );
  }

  async findAllAdmin(params: AdminListParams) {
    const page = Math.max(params.page || 1, 1);
    const limit = Math.min(Math.max(params.limit || 10, 1), 100);
    const conditions: any[] = [];

    if (params.q?.trim()) {
      const search = `%${params.q.trim()}%`;
      conditions.push(
        sql`(${researchProjects.titleTh} ILIKE ${search} OR ${researchProjects.titleEn} ILIKE ${search} OR ${researchProjects.abstractTh} ILIKE ${search} OR ${researchProjects.abstractEn} ILIKE ${search})`,
      );
    }
    if (params.year) conditions.push(eq(researchProjects.year, params.year));
    if (params.status) conditions.push(eq(researchProjects.status, params.status as any));

    const isPublished = this.parseBoolean(params.isPublished);
    if (isPublished !== undefined) conditions.push(eq(researchProjects.isPublished, isPublished));

    const isSocialService = this.parseBoolean(params.isSocialService);
    if (isSocialService !== undefined) conditions.push(eq(researchProjects.isSocialService, isSocialService));

    const isCommercial = this.parseBoolean(params.isCommercial);
    if (isCommercial !== undefined) conditions.push(eq(researchProjects.isCommercial, isCommercial));

    const whereCondition =
      conditions.length === 0 ? undefined : conditions.length === 1 ? conditions[0] : and(...conditions);

    const totalRows = whereCondition
      ? await this.drizzle.db
          .select({ count: count(researchProjects.id) })
          .from(researchProjects)
          .where(whereCondition)
      : await this.drizzle.db
          .select({ count: count(researchProjects.id) })
          .from(researchProjects);

    const baseQuery = this.drizzle.db
      .select({
        id: researchProjects.id,
        slug: researchProjects.slug,
        titleTh: researchProjects.titleTh,
        year: researchProjects.year,
        fundingSource: researchProjects.fundingSource,
        status: researchProjects.status,
        isSocialService: researchProjects.isSocialService,
        isCommercial: researchProjects.isCommercial,
        coverImageUrl: researchProjects.coverImageUrl,
        isPublished: researchProjects.isPublished,
        publishedAt: researchProjects.publishedAt,
        updatedAt: researchProjects.updatedAt,
        createdAt: researchProjects.createdAt,
      })
      .from(researchProjects);

    const projects = (whereCondition ? baseQuery.where(whereCondition) : baseQuery)
      .orderBy(desc(researchProjects.updatedAt), desc(researchProjects.createdAt))
      .limit(limit)
      .offset((page - 1) * limit);

    return {
      data: await this.enrichProjectsForList(await projects),
      meta: {
        total: Number(totalRows[0]?.count ?? 0),
        page,
        limit,
        totalPages: Math.ceil(Number(totalRows[0]?.count ?? 0) / limit),
      },
    };
  }

  async findOneAdmin(id: string) {
    return this.getProjectDetailByCondition(eq(researchProjects.id, id));
  }

  async exportAll(params: { q?: string; year?: number; status?: string; isPublished?: string; isSocialService?: string; isCommercial?: string }) {
    const conditions: any[] = [];
    if (params.q?.trim()) {
      const search = `%${params.q.trim()}%`;
      conditions.push(sql`(${researchProjects.titleTh} ILIKE ${search} OR ${researchProjects.titleEn} ILIKE ${search})`);
    }
    if (params.year) conditions.push(eq(researchProjects.year, params.year));
    if (params.status) conditions.push(eq(researchProjects.status, params.status as any));
    const isPublished = this.parseBoolean(params.isPublished);
    if (isPublished !== undefined) conditions.push(eq(researchProjects.isPublished, isPublished));
    const isSocialService = this.parseBoolean(params.isSocialService);
    if (isSocialService !== undefined) conditions.push(eq(researchProjects.isSocialService, isSocialService));
    const isCommercial = this.parseBoolean(params.isCommercial);
    if (isCommercial !== undefined) conditions.push(eq(researchProjects.isCommercial, isCommercial));

    const whereCondition = conditions.length === 0 ? undefined : conditions.length === 1 ? conditions[0] : and(...conditions);

    const rows = await (whereCondition
      ? this.drizzle.db.select().from(researchProjects).where(whereCondition)
      : this.drizzle.db.select().from(researchProjects)
    ).orderBy(desc(researchProjects.year), desc(researchProjects.createdAt));

    const enriched = await this.enrichProjectsForList(rows);

    const columns = [
      'ชื่อโครงการ (ไทย)', 'ชื่อโครงการ (อังกฤษ)', 'ปีงบประมาณ', 'สถานะ',
      'แหล่งทุน', 'งบประมาณ', 'รับใช้สังคม', 'เชิงพาณิชย์', 'เผยแพร่', 'ทีมวิจัย', 'SDGs',
      'ผลผลิต', 'ไฟล์แนบ',
    ];

    const escape = (v: any) => {
      const s = String(v ?? '');
      return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g, '""')}"` : s;
    };

    const csvRows = enriched.map((item: any) => [
      escape(item.titleTh),
      escape(item.titleEn || ''),
      escape(item.year),
      escape(item.status),
      escape(item.fundingSource || ''),
      escape(item.budget || ''),
      escape(item.isSocialService ? 'ใช่' : 'ไม่'),
      escape(item.isCommercial ? 'ใช่' : 'ไม่'),
      escape(item.isPublished ? 'ใช่' : 'ไม่'),
      escape(item.memberDisplay?.join('; ') || ''),
      escape(item.sdgIds?.join(', ') || ''),
      escape(item.outputCount ?? 0),
      escape(item.attachmentCount ?? 0),
    ].join(','));

    const bom = '\uFEFF';
    return bom + [columns.join(','), ...csvRows].join('\n');
  }

  async getStats() {
    const [totals, topSdgsRaw, outputCountRow] = await Promise.all([
      this.drizzle.db
        .select({
          total: count(researchProjects.id),
          socialServiceCount: sql<number>`count(case when ${researchProjects.isSocialService} = true then 1 end)`,
          commercialCount: sql<number>`count(case when ${researchProjects.isCommercial} = true then 1 end)`,
          publishedCount: sql<number>`count(case when ${researchProjects.isPublished} = true then 1 end)`,
          ongoingCount: sql<number>`count(case when ${researchProjects.status} = 'ONGOING' then 1 end)`,
          totalBudget: sql<string>`coalesce(sum(case when ${researchProjects.budget} is not null then ${researchProjects.budget}::numeric else 0 end), 0)`,
        })
        .from(researchProjects),
      this.drizzle.db
        .select({ sdgId: projectSdgs.sdgId, count: count(projectSdgs.projectId) })
        .from(projectSdgs)
        .groupBy(projectSdgs.sdgId)
        .orderBy(desc(count(projectSdgs.projectId)))
        .limit(5),
      this.drizzle.db
        .select({ total: count(researchOutputs.id) })
        .from(researchOutputs),
    ]);

    const total = Number(totals[0]?.total ?? 0);
    const socialServiceCount = Number(totals[0]?.socialServiceCount ?? 0);
    const commercialCount = Number(totals[0]?.commercialCount ?? 0);
    const publishedCount = Number(totals[0]?.publishedCount ?? 0);
    const ongoingCount = Number(totals[0]?.ongoingCount ?? 0);
    const totalBudget = Number(totals[0]?.totalBudget ?? 0);
    const outputCount = Number(outputCountRow[0]?.total ?? 0);

    return {
      total,
      publishedCount,
      ongoingCount,
      socialServiceCount,
      commercialCount,
      outputCount,
      totalBudget,
      socialServicePercent: total ? Math.round((socialServiceCount / total) * 100) : 0,
      commercialPercent: total ? Math.round((commercialCount / total) * 100) : 0,
      topSdgs: topSdgsRaw.map((item) => ({ sdgId: item.sdgId, count: Number(item.count) })),
    };
  }

  async getFilters() {
    const [years, fundingSources] = await Promise.all([
      this.drizzle.db
        .select({ year: researchProjects.year })
        .from(researchProjects)
        .groupBy(researchProjects.year)
        .orderBy(desc(researchProjects.year)),
      this.drizzle.db
        .select({ fundingSource: researchProjects.fundingSource })
        .from(researchProjects)
        .where(isNotNull(researchProjects.fundingSource))
        .groupBy(researchProjects.fundingSource)
        .orderBy(asc(researchProjects.fundingSource)),
    ]);

    return {
      years: years.map((item) => item.year),
      statuses: ['ONGOING', 'COMPLETED', 'PUBLISHED', 'CANCELLED'],
      fundingSources: fundingSources
        .map((item) => item.fundingSource)
        .filter((item): item is string => Boolean(item)),
      sdgs: Array.from({ length: 17 }, (_, index) => index + 1),
    };
  }

  async create(dto: CreateResearchProjectDto, _userId?: string) {
    this.ensureProjectMembers(dto.members);
    await this.ensureStaffProfilesExist(dto.members);

    const slug = this.generateSlug(dto.titleTh);
    const projectInsert = await this.drizzle.db
      .insert(researchProjects)
      .values({
        slug,
        titleTh: dto.titleTh,
        titleEn: dto.titleEn?.trim() || null,
        abstractTh: dto.abstractTh?.trim() || null,
        abstractEn: dto.abstractEn?.trim() || null,
        year: dto.year,
        budget: dto.budget ?? null,
        fundingSource: dto.fundingSource?.trim() || null,
        status: dto.status ?? 'ONGOING',
        isSocialService: dto.isSocialService ?? false,
        isCommercial: dto.isCommercial ?? false,
        coverImageUrl: dto.coverImageUrl?.trim() || null,
        keywords: dto.keywords ?? [],
        isPublished: dto.isPublished ?? true,
        publishedAt: dto.isPublished === false ? null : new Date(),
      })
      .returning({ id: researchProjects.id });

    const projectId = projectInsert[0].id;
    await this.syncNestedCollections(projectId, dto);
    return this.findOneAdmin(projectId);
  }

  async update(id: string, dto: UpdateResearchProjectDto) {
    const existing = await this.findOneAdmin(id);
    const existingMembers = this.normalizeExistingMembers(existing.members);
    const existingLocations = this.normalizeExistingLocations(existing.locations);
    const existingOutputs = this.normalizeExistingOutputs(existing.outputs);
    const existingAttachments = this.normalizeExistingAttachments(existing.attachments);

    this.ensureProjectMembers(dto.members);
    await this.ensureStaffProfilesExist(dto.members);

    const nextCoverImageUrl =
      dto.coverImageUrl !== undefined ? dto.coverImageUrl?.trim() || null : existing.coverImageUrl;

    // Handle slug change
    let nextSlug = existing.slug;
    if (dto.slug !== undefined && dto.slug !== existing.slug) {
      const conflict = await this.drizzle.db
        .select({ id: researchProjects.id })
        .from(researchProjects)
        .where(eq(researchProjects.slug, dto.slug))
        .limit(1);
      if (conflict.length) {
        throw new ConflictException(`Slug "${dto.slug}" ถูกใช้งานแล้วโดยโครงการอื่น`);
      }
      nextSlug = dto.slug;
    }

    const result = await this.drizzle.db
      .update(researchProjects)
      .set({
        titleTh: dto.titleTh ?? existing.titleTh,
        titleEn: dto.titleEn !== undefined ? dto.titleEn?.trim() || null : existing.titleEn,
        slug: nextSlug,
        abstractTh:
          dto.abstractTh !== undefined ? dto.abstractTh?.trim() || null : existing.abstractTh,
        abstractEn:
          dto.abstractEn !== undefined ? dto.abstractEn?.trim() || null : existing.abstractEn,
        year: dto.year ?? existing.year,
        budget: dto.budget !== undefined ? dto.budget ?? null : existing.budget,
        fundingSource:
          dto.fundingSource !== undefined
            ? dto.fundingSource?.trim() || null
            : existing.fundingSource,
        status: dto.status ?? existing.status,
        isSocialService: dto.isSocialService ?? existing.isSocialService,
        isCommercial: dto.isCommercial ?? existing.isCommercial,
        coverImageUrl: nextCoverImageUrl,
        keywords: dto.keywords ?? existing.keywords ?? [],
        isPublished: dto.isPublished ?? existing.isPublished,
        publishedAt:
          dto.isPublished === false
            ? null
            : existing.publishedAt || new Date(),
        updatedAt: new Date(),
      })
      .where(eq(researchProjects.id, id))
      .returning({ id: researchProjects.id });

    if (!result.length) {
      throw new NotFoundException(`Research project with ID ${id} not found`);
    }

    if (dto.coverImageUrl !== undefined && existing.coverImageUrl !== nextCoverImageUrl) {
      await this.cleanupResearchFile(existing.coverImageUrl);
    }

    if (dto.attachments) {
      const newUrls = dto.attachments.map(a => a.fileUrl).filter(Boolean);
      for (const old of existing.attachments || []) {
        if (old.fileUrl && !newUrls.includes(old.fileUrl)) {
          await this.cleanupResearchFile(old.fileUrl);
        }
      }
    }

    await this.syncNestedCollections(id, {
      members: dto.members ?? existingMembers,
      locations: dto.locations ?? existingLocations,
      sdgIds: dto.sdgIds ?? existing.sdgIds,
      outputs: dto.outputs ?? existingOutputs,
      attachments: dto.attachments ?? existingAttachments,
    });

    return this.findOneAdmin(id);
  }

  async downloadAttachment(id: string) {
    const result = await this.drizzle.db
      .update(researchAttachments)
      .set({ downloadCount: sql`${researchAttachments.downloadCount} + 1` })
      .where(eq(researchAttachments.id, id))
      .returning({ fileUrl: researchAttachments.fileUrl });

    if (!result.length) {
      throw new NotFoundException(`Attachment with ID ${id} not found`);
    }

    return { fileUrl: result[0].fileUrl };
  }

  async remove(id: string) {
    const existing = await this.findOneAdmin(id);

    const result = await this.drizzle.db
      .delete(researchProjects)
      .where(eq(researchProjects.id, id))
      .returning({ id: researchProjects.id, titleTh: researchProjects.titleTh });

    if (!result.length) {
      throw new NotFoundException(`Research project with ID ${id} not found`);
    }

    await this.cleanupResearchFile(existing.coverImageUrl);

    if (existing.attachments?.length) {
      for (const attachment of existing.attachments) {
        if (attachment.fileUrl) {
          await this.cleanupResearchFile(attachment.fileUrl);
        }
      }
    }

    return { message: 'Deleted successfully', data: result[0] };
  }
}
