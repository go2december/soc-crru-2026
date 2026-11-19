import { BadRequestException, NotFoundException } from '@nestjs/common';
import { OpenAlexService } from './openalex.service';

describe('OpenAlexService', () => {
  const mockDb = {
    select: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
  };
  const mockDrizzle = { db: mockDb } as any;
  let service: OpenAlexService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new OpenAlexService(mockDrizzle);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('normalizes ORCID, OpenAlex IDs, and DOIs', () => {
    expect(service.normalizeOrcid('https://orcid.org/0000-0002-1825-0097/')).toBe(
      '0000-0002-1825-0097',
    );
    expect(service.normalizeOpenAlexId('https://openalex.org/a12345')).toBe(
      'A12345',
    );
    expect(service.normalizeDoi('https://doi.org/10.1000/XYZ')).toBe(
      '10.1000/xyz',
    );
  });

  it('throws BadRequestException when staff has neither ORCID nor OpenAlex Author ID', async () => {
    await expect(service.resolveAuthorId(null, null)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('throws NotFoundException when ORCID is not found in OpenAlex', async () => {
    jest
      .spyOn(global, 'fetch')
      .mockResolvedValue({ status: 404, ok: false } as Response);

    await expect(
      service.resolveAuthorId('0000-0000-0000-0000', null),
    ).rejects.toThrow(NotFoundException);
  });

  it('syncs works, deduplicates by work ID/DOI, and updates staff profile', async () => {
    mockDb.select.mockReturnValue({
      from: () => ({
        where: jest.fn().mockResolvedValue([
          {
            id: 'staff-1',
            orcidId: '0000-0002-1825-0097',
            openalexAuthorId: null,
          },
        ]),
      }),
    });

    const onConflictDoUpdate = jest.fn().mockResolvedValue(undefined);
    mockDb.insert.mockReturnValue({
      values: jest.fn().mockReturnValue({ onConflictDoUpdate }),
    });

    const updateWhere = jest.fn().mockResolvedValue(undefined);
    const updateSet = jest.fn().mockReturnValue({ where: updateWhere });
    mockDb.update.mockReturnValue({ set: updateSet });

    jest
      .spyOn(global, 'fetch')
      .mockResolvedValueOnce({
        status: 200,
        ok: true,
        json: async () => ({ id: 'https://openalex.org/A500123' }),
      } as Response)
      .mockResolvedValueOnce({
        status: 200,
        ok: true,
        json: async () => ({
          results: [
            {
              id: 'https://openalex.org/W100',
              doi: 'https://doi.org/10.1234/ABC',
              title: 'Lanna Social Innovation',
              publication_year: 2025,
              publication_date: '2025-03-01',
              type: 'article',
              cited_by_count: 12,
              primary_location: {
                source: { display_name: 'Journal of Social Sciences' },
              },
              open_access: { is_oa: true, oa_url: 'https://example.org/oa.pdf' },
              authorships: [{ author: { display_name: 'Anchalee Wongvijit' } }],
            },
            {
              id: 'https://openalex.org/W101',
              doi: 'https://doi.org/10.1234/abc',
              title: 'Duplicate DOI should be skipped',
              publication_year: 2025,
            },
          ],
        }),
      } as Response);

    const res = await service.syncStaffById('staff-1');

    expect(res.openalexAuthorId).toBe('A500123');
    expect(res.syncedCount).toBe(1);
    expect(onConflictDoUpdate).toHaveBeenCalledTimes(1);
    expect(updateSet).toHaveBeenCalledWith(
      expect.objectContaining({ openalexAuthorId: 'A500123' }),
    );
  });
});
