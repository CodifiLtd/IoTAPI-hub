import request from 'supertest';
import app from '../src/app';
import bcrypt from 'bcrypt';

// Silence logs
jest.mock('../src/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn()
  }
}));

jest.mock('../src/services/userService', () => ({
  getUserByEmail: jest.fn().mockResolvedValue({
    id: 1,
    email: 'joebloggs@example.com',
    password: 'password',
    forename: 'Joe',
    surname: 'Bloggs',
    phone: '1234567890'
  })
}));

describe('Auth Routes', () => {
  it('should login with valid credentials', async () => {
    const bcryptCompare = jest.fn().mockResolvedValueOnce(true);
    (bcrypt.compare as jest.Mock) = bcryptCompare;

    const res = await request(app).post('/api/v1/login').send({
      email: 'joebloggs@example.com',
      password: 'password'
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should not login with invalid credentials', async () => {
    const bcryptCompare = jest.fn().mockResolvedValueOnce(false);
    (bcrypt.compare as jest.Mock) = bcryptCompare;

    const res = await request(app).post('/api/v1/login').send({
      email: 'bob@example.com',
      password: 'wrongpassword'
    });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error');
  });
});
