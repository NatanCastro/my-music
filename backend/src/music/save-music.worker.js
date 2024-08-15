import { parentPort, workerData } from 'worker_threads';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const { fileBuffer, filename, uploadDir } = workerData;

try {
  if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir, { recursive: true });
  }

  const filePath = join(uploadDir, filename);
  writeFileSync(filePath, fileBuffer);

  parentPort.postMessage('File saved successfully');
} catch (error) {
  parentPort.postMessage('Error saving file: ' + error.message);
}
