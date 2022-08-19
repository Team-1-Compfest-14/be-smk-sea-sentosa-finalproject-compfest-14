import { DataSource } from 'typeorm';
import 'reflect-metadata';
import config from '../configs/config';

export const AppDataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    host: config.isTest ? config.test.db.host : config.db.host,
    port: config.isTest ? config.test.db.port : config.db.port,
    username: config.isTest ? config.test.db.username : config.db.username,
    password: config.isTest ? config.test.db.password : config.db.password,
    database: config.isTest ? config.test.db.database : config.db.database,
    synchronize: false,
    migrationsRun: true,
    logging: true,
    entities: [`${__dirname}/entities/*.{ts,js}`],
    subscribers: [],
    migrations: [`${__dirname}/migrations/*.{ts,js}`],
    ssl: {
        rejectUnauthorized: false
    }
});