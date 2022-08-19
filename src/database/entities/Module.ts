import {
    BaseEntity,
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn
} from 'typeorm';
import { Course } from './Course';
import { Lecture } from './Lecture';
import { Quiz } from './Quiz';
import { ModuleCompletion } from './ModuleCompletion';

export enum ModuleType {
    LECTURE,
    QUIZ
}

@Entity('modules')
export class Module extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'course_id' })
    courseId!: number;

    @Column({ length: 64 })
    name!: string;

    @Column()
    order!: number;

    @Column()
    type!: number;

    @ManyToOne(() => Course, (course) => course.modules)
    @JoinColumn({ name: 'course_id' })
    course!: Course;

    @OneToOne(() => Quiz, (quiz) => quiz.module)
    quiz!: Quiz;

    @OneToOne(() => Lecture, (lecture) => lecture.module)
    lecture!: Lecture;

    @OneToOne(() => ModuleCompletion,
        (moduleCompletion) => moduleCompletion.module)
    moduleCompletion!: ModuleCompletion;

}