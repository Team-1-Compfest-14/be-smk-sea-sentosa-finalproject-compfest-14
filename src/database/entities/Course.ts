import {
    BaseEntity,
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn
} from 'typeorm';
import { CourseEnrollment } from './CourseEnrollment';
import { User } from './User';
import { Module } from './Module';

@Entity('courses')
export class Course extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'instructor_id' })
    instructorId!: number;

    @Column({ length: 64 })
    name!: string;

    @Column({ length: 128 })
    description!: string;

    @Column()
    isVerified!: boolean;

    @ManyToOne(() => User, (user) => user.courses)
    @JoinColumn({ name: 'instructor_id' })
    user!: User;

    @OneToMany(() => CourseEnrollment,
        (courseEnrollment) => courseEnrollment.course)
    courseEnrollments!: CourseEnrollment[];

    @OneToMany(() => Module,
        (module) => module.course)
    modules!: Module[];

}