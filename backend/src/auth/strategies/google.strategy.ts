import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor() {
        super({
            clientID: process.env.GOOGLE_CLIENT_ID || 'INSERT_CLIENT_ID',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'INSERT_CLIENT_SECRET',
            callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:4001/api/auth/google/callback',
            scope: ['email', 'profile'],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile,
    ): Promise<any> {
        const email = profile.emails?.[0]?.value;

        // ตรวจสอบว่าเป็น email @crru.ac.th เท่านั้น
        if (!email || !email.endsWith('@crru.ac.th')) {
            throw new Error('กรุณาใช้อีเมล @crru.ac.th ของมหาวิทยาลัยราชภัฏเชียงรายเท่านั้น');
        }

        const user = {
            googleId: profile.id,
            email: email,
            name: profile.displayName,
            avatar: profile.photos?.[0]?.value,
        };

        return user;
    }
}
