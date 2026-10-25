import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const paths: string[] = body.paths || ['/', '/about', '/about/structure', '/about/strategy'];

    if (Array.isArray(paths)) {
      for (const p of paths) {
        revalidatePath(p, 'page');
      }
    }

    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err: any) {
    return NextResponse.json({ revalidated: false, message: err.message }, { status: 500 });
  }
}
