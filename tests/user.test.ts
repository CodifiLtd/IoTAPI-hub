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

    if (id === 2) {
      return Promise.resolve({
        id: 2,
        email: 'janebloggs@example.com',
        forename: 'Jane',
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
  }),
  getUserDevicesById: jest.fn().mockImplementation(userId => {
    if (userId === 1) {
      return Promise.resolve([
        {
          id: 1,
          serialNumber: 'ABC123',
          name: 'Some name',
          description: 'Some description',
          firmwareVersion: '',
          householdId: 1,
          deviceTypeId: 1
        }
      ]);
    }
    return Promise.resolve([]);
  })
}));

const JWT_SECRET = 'so_secret';
const validToken = jwt.sign(
  { userId: 1, email: 'joebloggs@example.com' },
  JWT_SECRET,
  { expiresIn: '5m' }
);

describe('POST /users', () => {
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
});

describe('GET /users/:id', () => {
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

describe('GET /users/:id/devices', () => {
  it('should return 200 and a list of devices for authenticated user', async () => {
    const res = await request(app)
      .get('/api/v1/users/1/devices')
      .set('Authorization', `Bearer ${validToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(0);
    if (res.body.length > 0) {
      expect(res.body[0].serialNumber).toEqual('ABC123');
      expect(res.body[0].name).toEqual('Some name');
    }
  });

  it('should return 401 if no token is provided', async () => {
    const res = await request(app).get('/api/v1/users/1/devices');
    expect(res.status).toBe(401);
  });

  it('should return 403 if token userId does not match requested userId', async () => {
    const otherUserToken = jwt.sign(
      { userId: 2, email: 'other@example.com' },
      JWT_SECRET,
      { expiresIn: '5m' }
    );
    const res = await request(app)
      .get('/api/v1/users/1/devices')
      .set('Authorization', `Bearer ${otherUserToken}`);
    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty('error', 'User not authorised');
  });
});
