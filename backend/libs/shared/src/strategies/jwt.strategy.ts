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

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(@Optional() private readonly databaseService?: DatabaseService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'soc-crru-secret-key-2026',
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload) {
    const token = req.headers.authorization?.replace(/^Bearer\s+/i, '').trim();
    if (token && this.databaseService) {
      try {
        const blacklisted = await this.databaseService.db
          .select()
          .from(schema.tokenBlacklist)
          .where(eq(schema.tokenBlacklist.token, token))
          .then((r) => r[0]);
        if (blacklisted) {
          throw new UnauthorizedException('Token has been revoked');
        }
      } catch (err) {
        if (err instanceof UnauthorizedException) {
          throw err;
        }
        console.error('Error checking token blacklist in DB:', err);
      }
    }

    return {
      id: payload.sub,
      email: payload.email,
      roles: payload.roles,
      name: payload.name,
    };
  }
}
