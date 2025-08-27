import request from 'supertest';
import app from '../src/app';
import jwt from 'jsonwebtoken';

jest.mock('../src/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn()
  }
}));

jest.mock('../src/services/userService', () => ({
  createUser: jest.fn().mockResolvedValue({
    id: 1,
    email: 'joebloggs@example.com',
    password: 'password',
    forename: 'Joe',
    surname: 'Bloggs',
    phone: '1234567890'
  }),
  getUserById: jest.fn().mockImplementation(id => {
    if (id === 1) {
      return Promise.resolve({
        id: 1,
        email: 'joebloggs@example.com',
        forename: 'Joe',
        surname: 'Bloggs',
        phone: '1234567890'
      });
    }
    return Promise.resolve(null);
  }),
  getUserByEmail: jest.fn().mockResolvedValue({
    id: 1,
    email: 'joebloggs@example.com',
    password: 'password',
    forename: 'Joe',
    surname: 'Bloggs',
    phone: '1234567890'
  })
}));

describe('User Controller', () => {
  const JWT_SECRET = 'so_secret';
  const validToken = jwt.sign(
    { userId: 1, email: 'john@example.com' },
    JWT_SECRET,
    { expiresIn: '5m' }
  );

  it('should register a user', async () => {
    const res = await request(app).post('/api/v1/users').send({
      forename: 'Joe',
      surname: 'Bloggs',
      email: 'joebloggs@example.com',
      password: 'somepassword',
      phone: '1234567890'
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('email', 'joebloggs@example.com');
  });

  it('should not register user with invalid email', async () => {
    const res = await request(app).post('/api/v1/users').send({
      forename: 'Foo',
      surname: 'Bar',
      email: 'not-an-email',
      password: 'somepassword',
      phone: '1234567890'
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should get a user by id', async () => {
    const res = await request(app)
      .get('/api/v1/users/1')
      .set('Authorization', `Bearer ${validToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', 1);
    expect(res.body).toHaveProperty('email', 'joebloggs@example.com');
  });

  it('should return 404 for non-existent user', async () => {
    const res = await request(app)
      .get('/api/v1/users/999999')
      .set('Authorization', `Bearer ${validToken}`);

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error');
  });
});
