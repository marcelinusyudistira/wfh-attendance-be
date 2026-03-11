import 'dotenv/config';
import { AttendanceDataSource } from './data-source';

async function main() {
  await AttendanceDataSource.initialize();
  await AttendanceDataSource.runMigrations();
  await AttendanceDataSource.destroy();
}

main().catch(async (err) => {
  console.error(err);
  try {
    if (AttendanceDataSource.isInitialized) {
      await AttendanceDataSource.destroy();
    }
  } catch {}
  process.exit(1);
});
