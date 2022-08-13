import app from './app';
import { AppDataSource } from './database/data-source';
import config from './configs/config';

const port = config.port ?? 5000;
app.listen(port, async () => {
    await AppDataSource.initialize();
    console.log(`Server is running at http://localhost:${port}`);
});
