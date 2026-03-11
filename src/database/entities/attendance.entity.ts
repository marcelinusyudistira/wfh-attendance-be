import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Employee } from '../entities/employee.entity';

@Entity('attendances')
@Index(['employee_id', 'attendance_date'])
@Index(['attendance_date'])
export class Attendance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Employee, (employee) => employee.attendances)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column({ type: 'varchar', length: 36 })
  employee_id: string;

  @Column({ type: 'datetime', nullable: true })
  check_in: Date;

  @Column({ type: 'datetime', nullable: true })
  check_out: Date;

  @Column({ type: 'date', nullable: true })
  attendance_date: Date;

  @Column({ nullable: true })
  photo_checkin: string;

  @Column({ nullable: true })
  photo_checkout: string;

  @Column({
    type: 'enum',
    enum: ['CHECKED_IN', 'CHECKED_OUT', 'ABSENT', 'AUTO_CHECKOUT'],
    default: 'CHECKED_IN',
  })
  status: string;

  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
  checkin_lat: number;

  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
  checkin_long: number;

  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
  checkout_lat: number;

  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
  checkout_long: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  work_hours: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
