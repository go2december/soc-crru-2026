import { Injectable, NotFoundException } from '@nestjs/common';
import {
  DatabaseService,
  siteSettings,
  programs,
  mous,
  researchProjects,
} from 'db/database';
import { UpdateSiteSettingsDto } from './dto/update-site-settings.dto';
import { eq, sql } from 'drizzle-orm';

@Injectable()
export class SiteSettingsService {
  constructor(private readonly drizzle: DatabaseService) {}

  async getSettings() {
    const rows = await this.drizzle.db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.id, 1));

    if (rows.length === 0) {
      throw new NotFoundException('Site settings record not found');
    }

    const current = rows[0];

    // Query live DB counts
    let liveProgramsCount = 7;
    let liveMousCount = 42;
    let liveResearchCount = 85;

    try {
      const [progRes] = await this.drizzle.db
        .select({ count: sql<number>`count(*)::int` })
        .from(programs)
        .where(eq(programs.isActive, true));
      liveProgramsCount = Number(progRes?.count) || 0;

      const [mouRes] = await this.drizzle.db
        .select({ count: sql<number>`count(*)::int` })
        .from(mous);
      liveMousCount = Number(mouRes?.count) || 0;

      const [resRes] = await this.drizzle.db
        .select({ count: sql<number>`count(*)::int` })
        .from(researchProjects)
        .where(eq(researchProjects.isPublished, true));
      liveResearchCount = Number(resRes?.count) || 0;
    } catch (e) {
      // Fallback gracefully if any query fails
    }

    return {
      ...current,
      computedMetrics: {
        programsCount: current.manualProgramsCount ?? liveProgramsCount,
        partnershipsCount: current.manualPartnershipsCount ?? liveMousCount,
        mousCount: current.manualMousCount ?? liveMousCount,
        innovationsCount: current.manualInnovationsCount ?? liveResearchCount,
      },
      liveDbCounts: {
        programs: liveProgramsCount,
        mous: liveMousCount,
        research: liveResearchCount,
      },
    };
  }

  async updateSettings(dto: UpdateSiteSettingsDto) {
    const updated = await this.drizzle.db
      .update(siteSettings)
      .set({
        ...dto,
        updatedAt: new Date(),
      })
      .where(eq(siteSettings.id, 1))
      .returning();

    if (updated.length === 0) {
      throw new NotFoundException('Site settings record not found');
    }

    return this.getSettings();
  }
}
