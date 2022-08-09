import {
    BaseEntity,
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn
} from 'typeorm';
import { Course } from './Course';
import { CourseEnrollment } from './CourseEnrollment';
import { ModuleCompletion } from './ModuleCompletion';

@Entity('users')
export class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 64 })
    email!: string;

    @Column({ length: 64 })
    password!: string;

    @Column({ length: 64 })
    name!: string;

    @Column()
    role!: number;

    @Column()
    is_verified!: boolean;

    @Column()
    refresh_token!: string;

    @OneToMany(() => Course,
        (course) => course.user)
    courses!: Course[];

    @OneToMany(() => CourseEnrollment,
        (courseEnrollment) => courseEnrollment.user)
    courseEnrollments!: CourseEnrollment[];

    @OneToMany(() => ModuleCompletion,
        (moduleCompletion) => moduleCompletion.user)
    moduleCompletions!: ModuleCompletion[];

}