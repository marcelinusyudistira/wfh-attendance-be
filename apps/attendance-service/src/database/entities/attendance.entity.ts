import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('attendances')
@Index(['employee_id', 'attendance_date'])
@Index(['attendance_date'])
export class Attendance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 36 })
  employee_id: string;

  @Column({ type: 'datetime', nullable: true })
  check_in: Date | null;

  @Column({ type: 'datetime', nullable: true })
  check_out: Date | null;

  @Column({ type: 'date', nullable: true })
  attendance_date: Date | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  photo_checkin: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  photo_checkout: string | null;

  @Column({
    type: 'enum',
    enum: ['CHECKED_IN', 'CHECKED_OUT', 'ABSENT', 'AUTO_CHECKOUT'],
    default: 'CHECKED_IN',
  })
  status: 'CHECKED_IN' | 'CHECKED_OUT' | 'ABSENT' | 'AUTO_CHECKOUT';

  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
  checkin_lat: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
  checkin_long: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
  checkout_lat: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
  checkout_long: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  work_hours: number | null;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
