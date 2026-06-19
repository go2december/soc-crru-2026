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

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'soc-crru-secret-key-2026',
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
