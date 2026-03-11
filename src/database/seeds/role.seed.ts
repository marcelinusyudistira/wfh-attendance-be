import { DataSource } from 'typeorm';
import { Role } from '../entities/role.entity';

export const seedRoles = async (dataSource: DataSource) => {
  const repo = dataSource.getRepository(Role);

  const roles = [{ role_name: 'ADMIN' }, { role_name: 'EMPLOYEE' }];

  const entities = repo.create(roles);

  await repo.save(entities);

  console.log('✅ Roles Seeded');
};
