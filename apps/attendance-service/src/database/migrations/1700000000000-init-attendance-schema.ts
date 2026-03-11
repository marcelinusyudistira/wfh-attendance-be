import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class InitAttendanceSchema1700000000000 implements MigrationInterface {
  name = 'InitAttendanceSchema1700000000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'attendances',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            length: '36',
            isPrimary: true,
            isNullable: false,
          },
          {
            name: 'employee_id',
            type: 'varchar',
            length: '36',
            isNullable: false,
          },
          {
            name: 'check_in',
            type: 'datetime',
            isNullable: true,
          },
          {
            name: 'check_out',
            type: 'datetime',
            isNullable: true,
          },
          {
            name: 'attendance_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'photo_checkin',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'photo_checkout',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['CHECKED_IN', 'CHECKED_OUT', 'ABSENT', 'AUTO_CHECKOUT'],
            default: `'CHECKED_IN'`,
            isNullable: false,
          },
          {
            name: 'checkin_lat',
            type: 'decimal',
            precision: 10,
            scale: 6,
            isNullable: true,
          },
          {
            name: 'checkin_long',
            type: 'decimal',
            precision: 10,
            scale: 6,
            isNullable: true,
          },
          {
            name: 'checkout_lat',
            type: 'decimal',
            precision: 10,
            scale: 6,
            isNullable: true,
          },
          {
            name: 'checkout_long',
            type: 'decimal',
            precision: 10,
            scale: 6,
            isNullable: true,
          },
          {
            name: 'work_hours',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'attendances',
      new TableIndex({
        name: 'IDX_attendances_employee_date',
        columnNames: ['employee_id', 'attendance_date'],
      }),
    );

    await queryRunner.createIndex(
      'attendances',
      new TableIndex({
        name: 'IDX_attendances_attendance_date',
        columnNames: ['attendance_date'],
      }),
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex(
      'attendances',
      'IDX_attendances_attendance_date',
    );
    await queryRunner.dropIndex('attendances', 'IDX_attendances_employee_date');
    await queryRunner.dropTable('attendances');
  }
}
