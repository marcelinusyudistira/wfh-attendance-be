import 'dotenv/config';
import { EmployeeDataSource } from './data-source';

async function main() {
  await EmployeeDataSource.initialize();
  await EmployeeDataSource.runMigrations();
  await EmployeeDataSource.destroy();
}

main().catch(async (err) => {
  console.error(err);
  try {
    if (EmployeeDataSource.isInitialized) {
      await EmployeeDataSource.destroy();
    }
  } catch {}
  process.exit(1);
});
