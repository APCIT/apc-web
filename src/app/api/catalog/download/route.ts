import { NextResponse } from 'next/server';
import { respondWithBlobFile } from '@/lib/blob-response';
import {
  CATALOG_PDF_BLOB,
  CATALOG_PDF_CONTAINER,
} from '@/data/professionalServices';

/** Public catalog download — streams from Azure via connection string. */
export async function GET() {
  try {
    return await respondWithBlobFile({
      container: CATALOG_PDF_CONTAINER,
      blobName: CATALOG_PDF_BLOB,
      disposition: 'attachment',
    });
  } catch {
    return NextResponse.json({ error: 'Unable to download catalog' }, { status: 502 });
  }
}
