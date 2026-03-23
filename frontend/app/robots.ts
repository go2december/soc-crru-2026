import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/admin/',
                    '/chiang-rai-studies/admin/',
                    '/debug-env/',
                    '/api/',
                ],
            },
        ],
        sitemap: 'https://soc.crru.ac.th/sitemap.xml',
    };
}
