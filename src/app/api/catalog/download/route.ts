import { NextResponse } from 'next/server';
import { CATALOG_PDF_URL } from '@/data/professionalServices';

export async function GET() {
  try {
    const response = await fetch(CATALOG_PDF_URL, { cache: 'no-store' });
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Unable to download catalog' },
        { status: response.status }
      );
    }

    const headers = new Headers();
    headers.set('Content-Type', 'application/pdf');
    headers.set(
      'Content-Disposition',
      'attachment; filename="APC Professional Services Catalog 2026.pdf"'
    );
    const length = response.headers.get('Content-Length');
    if (length) headers.set('Content-Length', length);

    return new NextResponse(response.body, { status: 200, headers });
  } catch {
    return NextResponse.json({ error: 'Unable to download catalog' }, { status: 502 });
  }
}
