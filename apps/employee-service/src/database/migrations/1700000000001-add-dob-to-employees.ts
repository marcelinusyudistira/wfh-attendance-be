import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddDobToEmployees1700000000001 implements MigrationInterface {
  name = 'AddDobToEmployees1700000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'employees',
      new TableColumn({
        name: 'dob',
        type: 'date',
        isNullable: true,
      }),
    );

    await queryRunner.query(
      "UPDATE employees SET dob = '1990-01-01' WHERE dob IS NULL",
    );

    await queryRunner.changeColumn(
      'employees',
      'dob',
      new TableColumn({
        name: 'dob',
        type: 'date',
        isNullable: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('employees', 'dob');
  }
}
