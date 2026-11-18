import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4001',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'api-gateway',
        port: '3000',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4501',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'soc_backend',
        port: '4501',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'soc_backend',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'backend',
        port: '3000',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'backend',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'soc.crru.ac.th',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self'; object-src 'none'; base-uri 'self';",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/academics/overview',
        destination: '/programs',
        permanent: true,
      },
      {
        source: '/eservice',
        destination: '/eservice/student',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    const internalApiUrl = process.env.INTERNAL_API_URL || 'http://localhost:4001';
    return [
      {
        source: '/api/:path*',
        destination: `${internalApiUrl}/api/:path*`,
      },
      {
        source: '/uploads/:path*',
        destination: `${internalApiUrl}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
