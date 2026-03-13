import { diskStorage } from 'multer';
import type { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { extname } from 'node:path';
import { mkdirSync } from 'node:fs';

function ensureDir(path: string) {
  mkdirSync(path, { recursive: true });
}

function resolveAttendanceDestination(req: any): string {
  const url: string = String(req?.originalUrl ?? req?.url ?? '').toLowerCase();

  if (url.includes('/attendance/checkout')) {
    return 'uploads/attendance/checkout';
  }

  return 'uploads/attendance/checkin';
}

export const attendanceMulterConfig: MulterOptions = {
  storage: diskStorage({
    destination: (req, _file, cb) => {
      const dest = resolveAttendanceDestination(req);
      ensureDir(dest);
      cb(null, dest);
    },
    filename: (_req, file, cb) => {
      const extension = extname(file.originalname);
      const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${unique}${extension}`);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
};
