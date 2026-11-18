import { Injectable, UnauthorizedException, Optional } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { Request } from 'express';
import { DatabaseService, schema } from 'db/database';
import { eq } from 'drizzle-orm';

export interface JwtPayload {
  sub: string; // user id
  email: string;
  roles: string[];
  name: string;
}

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('JWT_SECRET environment variable must be set in production');
    }
    return 'dev-only-jwt-secret-do-not-use-in-prod';
  }
  return secret;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(@Optional() private readonly databaseService?: DatabaseService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: getJwtSecret(),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload) {
    const token = req.headers.authorization?.replace(/^Bearer\s+/i, '').trim();
    if (!token || !this.databaseService) {
      throw new UnauthorizedException('Authentication verification unavailable');
    }

    try {
      const blacklisted = await this.databaseService.db
        .select()
        .from(schema.tokenBlacklist)
        .where(eq(schema.tokenBlacklist.token, token))
        .then((r) => r[0]);
      if (blacklisted) {
        throw new UnauthorizedException('Token has been revoked');
      }

      // Live check user isActive status in database
      const dbUser = await this.databaseService.db
        .select({
          id: schema.users.id,
          isActive: schema.users.isActive,
          roles: schema.users.roles,
          departmentId: schema.users.departmentId,
        })
        .from(schema.users)
        .where(eq(schema.users.id, payload.sub))
        .then((r) => r[0]);

      if (!dbUser) {
        throw new UnauthorizedException('User account no longer exists');
      }

      if (!dbUser.isActive) {
        throw new UnauthorizedException('User account has been deactivated');
      }

      return {
        id: payload.sub,
        email: payload.email,
        roles: dbUser.roles || payload.roles,
        departmentId: dbUser.departmentId,
        name: payload.name,
      };
    } catch (err) {
      if (err instanceof UnauthorizedException) {
        throw err;
      }
      console.error('Error checking user/token in DB:', err);
      throw new UnauthorizedException('Authentication verification failed');
    }
  }
}
