import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { Request } from 'express';

export interface JwtPayload {
  sub: string; // user id
  email: string;
  roles: string[];
  name: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'soc-crru-secret-key-2026',
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload) {
    const token = req.headers.authorization?.replace(/^Bearer\s+/i, '').trim();
    if (token) {
      const authServiceHost = process.env.AUTH_SERVICE_HOST || 'localhost';
      try {
        const response = await fetch(
          `http://${authServiceHost}:3001/auth/blacklist/check`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token }),
          },
        );
        if (response.ok) {
          const data = await response.json();
          if (data && data.isBlacklisted) {
            throw new UnauthorizedException('Token has been revoked');
          }
        }
      } catch (err) {
        if (err instanceof UnauthorizedException) {
          throw err;
        }
        console.error('Error checking token blacklist:', err);
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
