import type { ReplayDto } from './types';

const BASE = '/api';

/**
 * Upload a .osr file and receive parsed replay metadata.
 */
export async function parseReplay(file: File): Promise<ReplayDto> {
  const form = new FormData();
  form.append('file', file);

  const res = await fetch(`${BASE}/parse`, { method: 'POST', body: form });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

/**
 * Send updated metadata (with raw_b64 from the parse step)
 * and download the new .osr file.
 */
export async function writeReplay(dto: ReplayDto, filename: string): Promise<void> {
  const res = await fetch(`${BASE}/write`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(dto),
  });
  if (!res.ok) throw new Error(await res.text());

  const blob = await res.blob();
  const url  = URL.createObjectURL(blob);
  const a    = Object.assign(document.createElement('a'), {
    href:     url,
    download: filename.endsWith('.osr') ? filename : `${filename}.osr`,
  });
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
