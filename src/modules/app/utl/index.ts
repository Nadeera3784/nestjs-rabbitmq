import * as fs from 'fs';

export function base64Encode(file: string, imageType: string): string {
  const bitmap = fs.readFileSync(file);
  const base64String = Buffer.from(bitmap).toString('base64');
  return `data:${imageType};base64,${base64String}`;
}

export function deleteFile(
  uploadDir: string,
  oldFileName: string,
): Promise<boolean> {
  const fileNameWithPath = `${uploadDir}${oldFileName}`;
  return new Promise<boolean>((resolve) => {
    if (fs.existsSync(fileNameWithPath)) {
      fs.unlink(fileNameWithPath, (err: NodeJS.ErrnoException | null) => {
        if (err) {
          console.error(err);
          resolve(false);
        } else {
          resolve(true);
        }
      });
    } else {
      resolve(false);
    }
  });
}
