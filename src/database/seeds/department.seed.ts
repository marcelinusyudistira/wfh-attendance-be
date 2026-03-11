import { DataSource } from 'typeorm';
import { Department } from '../entities/department.entity';

export const seedDepartments = async (dataSource: DataSource) => {
  const repo = dataSource.getRepository(Department);

  const departments = [
    { department_name: 'ENGINEER' },
    { department_name: 'HR' },
    { department_name: 'FINANCE' },
    { department_name: 'MARKETING' },
  ];

  const entities = repo.create(departments);

  await repo.save(entities);

  console.log('✅ Departments Seeded');
};
