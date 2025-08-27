import { handleApiError } from '../src/utils/errorHandler';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

jest.mock('../src/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn()
  }
}));

describe('handleApiError', () => {
  const mockRes = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);

    return res;
  };

  it('should handle ZodError', () => {
    const error = new ZodError([
      { path: ['email'], message: 'Invalid email', code: 'custom' }
    ]);
    const res = mockRes();

    handleApiError(error, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: ['Invalid email'] });
  });

  it('should handle PrismaClientKnownRequestError', () => {
    const error = new Prisma.PrismaClientKnownRequestError(
      'Unique constraint failed',
      {
        code: 'P2002',
        clientVersion: '4.0.0'
      }
    );
    const res = mockRes();

    handleApiError(error, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Unique constraint failed'
    });
  });

  it('should handle generic Error', () => {
    const error = Error('Some error');
    const res = mockRes();

    handleApiError(error, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: expect.stringContaining('Some error')
    });
  });
});
