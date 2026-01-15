import { fetchPrograms } from '@/lib/api';

export default async function DebugEnvPage() {
    const checks = [
        'http://soc_backend:3000/api/programs',
        'http://backend:3000/api/programs',
        'http://host.docker.internal:3002/api/programs',
        'http://localhost:3002/api/programs',
        'http://127.0.0.1:3002/api/programs'
    ];

    const results = await Promise.all(checks.map(async (url) => {
        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 2000);
            const start = Date.now();
            const res = await fetch(url, {
                signal: controller.signal,
                cache: 'no-store'
            });
            clearTimeout(timeout);
            return {
                url,
                status: res.status,
                ok: res.ok,
                time: Date.now() - start
            };
        } catch (error: any) {
            return {
                url,
                status: 'ERROR',
                error: error.message
            };
        }
    }));

    return (
        <div className="p-8 font-mono text-sm">
            <h1 className="text-2xl font-bold mb-4">SSR Connectivity Debug</h1>
            <p className="mb-4">Running on Node: {process.version}</p>
            <div className="space-y-2">
                {results.map((r, i) => (
                    <div key={i} className={`p-4 border rounded ${r.ok ? 'bg-green-100 border-green-500' : 'bg-red-50 border-red-300'}`}>
                        <div className="font-bold">{r.url}</div>
                        <div>Status: {r.status}</div>
                        {r.time && <div>Time: {r.time}ms</div>}
                        {r.error && <div className="text-red-600">Error: {r.error}</div>}
                    </div>
                ))}
            </div>
            <div className="mt-8">
                <hr />
                <h2 className="text-xl font-bold mt-4">Environment</h2>
                <pre>{JSON.stringify(process.env, null, 2)}</pre>
            </div>
        </div>
    );
}
