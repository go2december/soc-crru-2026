import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService, schema } from 'db/database';
import { UnauthorizedException } from '@nestjs/common';

// Minimal mock implementations
const mockUser = {
  id: 'user-1',
  email: 'test@crru.ac.th',
  name: 'Test User',
  avatar: 'avatar.png',
  roles: ['STAFF'],
};

const mockRefreshTokens: any[] = [];
const mockTokenBlacklist: any[] = [];

const extractValue = (condition: any) => {
  if (!condition || !Array.isArray(condition.queryChunks)) return undefined;
  const paramChunk = condition.queryChunks.find(
    (chunk: any) =>
      chunk &&
      typeof chunk === 'object' &&
      'value' in chunk &&
      typeof chunk.value === 'string',
  );
  return paramChunk ? paramChunk.value : undefined;
};

const mockDatabaseService = {
  db: {
    select: jest.fn().mockImplementation(() => {
      return {
        from: (table: any) => {
          return {
            where: (condition: any) => {
              return {
                then: (cb: (rows: any[]) => any) => {
                  if (table === schema.users) {
                    return cb([mockUser]);
                  }
                  if (table === schema.refreshTokens) {
                    const tokenVal = extractValue(condition);
                    const found = mockRefreshTokens.find(
                      (t) => t.token === tokenVal,
                    );
                    return cb(found ? [found] : []);
                  }
                  if (table === schema.tokenBlacklist) {
                    const tokenVal = extractValue(condition);
                    const found = mockTokenBlacklist.find(
                      (t) => t.token === tokenVal,
                    );
                    return cb(found ? [found] : []);
                  }
                  return cb([]);
                },
              };
            },
          };
        },
      };
    }),
    insert: jest.fn().mockImplementation((table: any) => {
      return {
        values: (data: any) => {
          if (table === schema.refreshTokens) {
            mockRefreshTokens.push(data);
          } else if (table === schema.tokenBlacklist) {
            mockTokenBlacklist.push(data);
          }
          return {
            onConflictDoNothing: () => Promise.resolve(),
          };
        },
      };
    }),
    delete: jest.fn().mockImplementation((table: any) => {
      return {
        where: (condition: any) => {
          if (table === schema.refreshTokens) {
            const tokenVal = extractValue(condition);
            const idx = mockRefreshTokens.findIndex(
              (t) => t.token === tokenVal,
            );
            if (idx !== -1) {
              mockRefreshTokens.splice(idx, 1);
            }
          }
          return Promise.resolve();
        },
      };
    }),
  },
} as unknown as DatabaseService;

const mockJwtService = {
  sign: jest.fn().mockReturnValue('signed-access-token'),
  decode: jest
    .fn()
    .mockReturnValue({ exp: Math.floor(Date.now() / 1000) + 3600 }),
} as unknown as JwtService;

describe('AuthService (database-backed token logic)', () => {
  let service: AuthService;

  beforeEach(async () => {
    jest.clearAllMocks();
    mockRefreshTokens.length = 0;
    mockTokenBlacklist.length = 0;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: DatabaseService, useValue: mockDatabaseService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should issue and store a refresh token', async () => {
    const token = await service.issueRefreshToken(mockUser.id);
    expect(typeof token).toBe('string');
    const stored = mockRefreshTokens.find((t) => t.token === token);
    expect(stored).toBeDefined();
    expect(stored.userId).toBe(mockUser.id);
  });

  it('should refresh access token with a valid static refresh token', async () => {
    const refreshToken = await service.issueRefreshToken(mockUser.id);
    const result = await service.refreshAccessToken(refreshToken);
    expect(result.accessToken).toBe('signed-access-token');
    expect(result.refreshToken).toBe(refreshToken);
  });

  it('should reject an invalid refresh token', async () => {
    await expect(service.refreshAccessToken('invalid-token')).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should blacklist access token on logout and delete the refresh token', async () => {
    const refreshToken = await service.issueRefreshToken(mockUser.id);
    const accessToken = 'Bearer signed-access-token';
    await service.logout(accessToken, refreshToken);

    const isBlacklisted = mockTokenBlacklist.some(
      (t) => t.token === 'signed-access-token',
    );
    expect(isBlacklisted).toBe(true);

    // Refresh token should be removed
    const stored = mockRefreshTokens.find((t) => t.token === refreshToken);
    expect(stored).toBeUndefined();
  });
});
