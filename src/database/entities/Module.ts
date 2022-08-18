import {
    BaseEntity,
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
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

    @OneToMany(() => Quiz, (quiz) => quiz.module)
    quizzes!: Quiz[];

    @OneToMany(() => Lecture, (lecture) => lecture.module)
    lectures!: Lecture[];

    @OneToMany(() => ModuleCompletion,
        (moduleCompletion) => moduleCompletion.module)
    moduleCompletions!: ModuleCompletion[];

}