import express, { type Application, type Request, type Response } from 'express';
import cors from 'cors';

import columnsRouter from './routes/columns.js';
import tasksRouter from './routes/tasks.js';

const app: Application = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'Ell Kanban API ready' });
});

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.use('/api/columns', columnsRouter);
app.use('/api/tasks', tasksRouter);

export default app;
