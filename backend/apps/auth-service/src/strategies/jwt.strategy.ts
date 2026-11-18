import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';

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
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: getJwtSecret(),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload) {
    const token = req.headers.authorization?.replace(/^Bearer\s+/i, '').trim();
    if (token && (await this.authService.isTokenBlacklisted(token))) {
      throw new UnauthorizedException('Token has been revoked');
    }
    return {
      id: payload.sub,
      email: payload.email,
      roles: payload.roles,
      name: payload.name,
    };
  }
}
