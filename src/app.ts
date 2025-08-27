import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { logger } from './logger/index';
import routes from './routes/index';

import type { Application, NextFunction, Request, Response } from 'express';

const app: Application = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

// Health check
app.get(
  '/health',
  (
    _req: Request,
    res: Response<{ status: string }>
  ): Response<{ status: string }> => {
    return res.status(200).json({ status: 'ok' });
  }
);

app.use('/api/v1', routes);

// Global error handler
app.use(
  (
    err: Error,
    _req: Request,
    res: Response<{ error: string }>,
    _next: NextFunction
  ): Response<{ error: string }> => {
    logger.error(err.message, { stack: err.stack });
    console.log(res);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
);

export default app;
