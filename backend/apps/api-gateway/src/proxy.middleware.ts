import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import * as http from 'http';

@Injectable()
export class ProxyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    const url = req.originalUrl;
    let targetPort: number | null = null;
    let targetHost = 'localhost';

    if (url.startsWith('/api/auth')) {
      targetPort = 3001;
      targetHost = process.env.AUTH_SERVICE_HOST || 'localhost';
    } else if (url.startsWith('/api/news')) {
      targetPort = 3002;
      targetHost = process.env.NEWS_SERVICE_HOST || 'localhost';
    } else if (url.startsWith('/api/chiang-rai')) {
      targetPort = 3003;
      targetHost = process.env.CHIANG_RAI_SERVICE_HOST || 'localhost';
    } else if (
      url.startsWith('/api/programs') ||
      url.startsWith('/api/departments') ||
      url.startsWith('/api/admissions')
    ) {
      targetPort = 3004;
      targetHost = process.env.PROGRAMS_SERVICE_HOST || 'localhost';
    } else if (url.startsWith('/api/staff')) {
      targetPort = 3005;
      targetHost = process.env.STAFF_SERVICE_HOST || 'localhost';
    } else if (
      url.startsWith('/api/research') ||
      url.startsWith('/api/academic-services')
    ) {
      targetPort = 3006;
      targetHost = process.env.RESEARCH_SERVICE_HOST || 'localhost';
    }

    if (!targetPort) {
      // If it doesn't match any microservice prefixes, pass to api-gateway's own handlers (like /upload or /uploads)
      return next();
    }

    const targetUrl = `http://${targetHost}:${targetPort}${url}`;
    const parsedUrl = new URL(targetUrl);

    // Proxy request using native Node.js http module
    const proxyReq = http.request(
      {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port,
        path: parsedUrl.pathname + parsedUrl.search,
        method: req.method,
        headers: req.headers,
      },
      (proxyRes) => {
        res.writeHead(proxyRes.statusCode || 500, proxyRes.headers);
        proxyRes.pipe(res, { end: true });
      },
    );

    proxyReq.on('error', (err) => {
      res.status(502).json({
        message: `Bad Gateway: Could not reach ${parsedUrl.pathname}`,
        error: err.message,
      });
    });

    const methodsWithBody = ['POST', 'PUT', 'PATCH', 'DELETE'];
    if (methodsWithBody.includes(req.method) && req.body !== undefined) {
      const bodyData = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
      proxyReq.setHeader('content-length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
      proxyReq.end();
    } else {
      req.pipe(proxyReq, { end: true });
    }
  }
}
