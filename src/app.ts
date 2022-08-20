import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import routes from './routes';
import errorHandling from './middlewares/error.middleware';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(routes);
app.use(errorHandling);

export default app;