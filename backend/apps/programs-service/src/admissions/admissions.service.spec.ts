import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from 'db/database';
import { AdmissionsService } from './admissions.service';

class MockDatabaseService {
  db = {
    select: async () => [],
    insert: async () => [],
    update: async () => [],
    delete: async () => [],
  };
}

describe('AdmissionsService', () => {
  let service: AdmissionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdmissionsService,
        { provide: DatabaseService, useClass: MockDatabaseService },
      ],
    }).compile();

    service = module.get<AdmissionsService>(AdmissionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
