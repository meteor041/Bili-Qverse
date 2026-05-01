import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

export async function readJson(file, fallback) {
  try {
    return JSON.parse(await readFile(file, 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') return fallback;
    throw error;
  }
}

export async function writeJson(file, data) {
  await mkdir(dirname(file), { recursive: true });
  const tempFile = `${file}.tmp`;
  await writeFile(tempFile, `${JSON.stringify(data, null, 2)}\n`);
  await rename(tempFile, file);
}
