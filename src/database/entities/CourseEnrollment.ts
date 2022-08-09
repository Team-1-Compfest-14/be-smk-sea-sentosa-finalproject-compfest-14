import {
    BaseEntity,
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn
} from 'typeorm';
import { Course } from './Course';
import { User } from './User';

@Entity('courses')
export class CourseEnrollment extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'user_id' })
    userId!: number;

    @Column({ name: 'course_id' })
    courseId!: number;

    @ManyToOne(() => User, (user) => user.courseEnrollments)
    @JoinColumn({ name: 'user_id' })
    user!: User;

    @ManyToOne(() => Course, (course) => course.courseEnrollments)
    @JoinColumn({ name: 'course_id' })
    course!: Course;

}