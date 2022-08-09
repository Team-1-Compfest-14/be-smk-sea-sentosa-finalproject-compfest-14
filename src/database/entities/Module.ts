import {
    BaseEntity,
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn
} from 'typeorm';
import { Course } from './Course';

enum ModuleType {
    Lecture = 'lecture',
    Quiz = 'quiz'
}

@Entity('modules')
export class Module extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Course, (course) => course.modules)
    @JoinColumn({ name: 'course_id' })
    course!: Course;

    @Column()
    order!: number;

    @Column({ length: 64 })
    name!: string;

    @Column({ type: 'enum', enum: ModuleType })
    type!: ModuleType;

}