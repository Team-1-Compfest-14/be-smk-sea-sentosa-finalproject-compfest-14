import { DateTime } from 'luxon';
import {
    BaseEntity,
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn
} from 'typeorm';
import { DateColumn } from '.';
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

    @DateColumn({ name: 'completion_time' })
    completionTime!: DateTime;

    @ManyToOne(() => Module, (module) => module.moduleCompletions)
    @JoinColumn({ name: 'module_id' })
    module!: Module;

    @ManyToOne(() => User, (user) => user.moduleCompletions)
    @JoinColumn({ name: 'user_id' })
    user!: User;

}