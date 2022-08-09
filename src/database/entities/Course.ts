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

@Entity('courses')
export class Course extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, (user) => user.courses)
    @JoinColumn({ name: 'instructor_id' })
    user!: User;

    @Column({ length: 64 })
    name!: string;

    @Column({ length: 128 })
    description!: string;

    @Column()
    is_verified!: boolean;

    @OneToMany(() => CourseEnrollment,
        (courseEnrollment) => courseEnrollment.course)
    courseEnrollments!: CourseEnrollment[];

}