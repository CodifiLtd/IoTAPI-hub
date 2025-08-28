import { type Prisma, PrismaClient } from '@prisma/client';
import { logger } from '../logger/index';

const isProduction = process.env['NODE_ENV'] === 'production';

interface GlobalPrisma {
  prisma: PrismaClient | undefined;
}
const globalForPrisma = globalThis as unknown as GlobalPrisma;

export const prisma: PrismaClient =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: [
      { level: 'query', emit: 'event' },
      { level: 'warn', emit: 'event' },
      { level: 'error', emit: 'event' }
    ]
  });

if (isProduction) {
  globalForPrisma.prisma = prisma;
} else {
  // Only log queries in dev
  prisma.$on('query' as never, (e: Prisma.QueryEvent) => {
    logger.debug('Prisma query', {
      query: e.query,
      params: e.params,
      duration: e.duration
    });
  });
}

// Always log warnings and errors
prisma.$on('warn' as never, (e: Prisma.LogEvent) =>
  logger.warn('Prisma warning', { message: e.message })
);

prisma.$on('error' as never, (e: Prisma.LogEvent) =>
  logger.error('Prisma error', { message: e.message })
);
