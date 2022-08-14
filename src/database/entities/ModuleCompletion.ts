import {
    BaseEntity,
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn
} from 'typeorm';
import { Module } from './Module';
import { User } from './User';

@Entity('module_completions')
export class ModuleCompletion extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'module_id' })
    moduleId!: number;

    @Column({ name: 'user_id' })
    userId!: number;

    @Column({ name: 'completion_time' })
    completionTime!: Date;

    @ManyToOne(() => Module, (module) => module.moduleCompletions)
    @JoinColumn({ name: 'module_id' })
    module!: Module;

    @ManyToOne(() => User, (user) => user.moduleCompletions)
    @JoinColumn({ name: 'user_id' })
    user!: User;

}