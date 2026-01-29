import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export interface JwtPayload {
    sub: string;     // user id
    email: string;
    role: string;
    name: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'soc-crru-secret-key-2026',
        });
    }

    async validate(payload: JwtPayload) {
        return {
            id: payload.sub,
            email: payload.email,
            role: payload.role,
            name: payload.name,
        };
    }
}
