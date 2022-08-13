import { AppDataSourceTest } from './src/database/data-source';

beforeAll(async () => {
    await AppDataSourceTest.initialize();
});

afterAll(async () => {
    await AppDataSourceTest.destroy();
});
