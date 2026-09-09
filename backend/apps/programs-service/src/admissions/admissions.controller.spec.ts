import { Test, TestingModule } from '@nestjs/testing';
import { PassportModule } from '@nestjs/passport';
import { AdmissionsController } from './admissions.controller';
import { AdmissionsService } from './admissions.service';
import { DatabaseService } from 'db/database';

describe('AdmissionsController', () => {
  let controller: AdmissionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [AdmissionsController],
      providers: [
        AdmissionsService,
        {
          provide: DatabaseService,
          useValue: {
            db: {
              select: async () => [],
              insert: async () => [],
              update: async () => [],
              delete: async () => [],
            },
          },
        },
      ],
    }).compile();

    controller = module.get<AdmissionsController>(AdmissionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
