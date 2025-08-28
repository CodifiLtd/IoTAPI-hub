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

jest.mock('../src/services/deviceConfigService', () => ({
  getDeviceConfigById: jest.fn().mockImplementation(id => {
    if (id === 1) {
      return Promise.resolve({
        id: 1,
        config: { foo: 'bar' },
        deviceId: 1,
        createdAt: new Date('2023-01-01T00:00:00Z'),
        updatedAt: new Date('2023-01-02T00:00:00Z')
      });
    }
    return Promise.resolve(null);
  }),
  upsertDeviceConfig: jest.fn().mockImplementation((id, config) => {
    return Promise.resolve({
      id: 1,
      config,
      deviceId: id,
      createdAt: new Date('2023-01-01T00:00:00Z'),
      updatedAt: new Date('2023-01-02T00:00:00Z')
    });
  })
}));

jest.mock('../src/services/userService', () => ({
  getUserById: jest.fn().mockImplementation(id => {
    if (id === 1) {
      return Promise.resolve({
        id: 1,
        email: 'joebloggs@example.com',
        forename: 'Joe',
        surname: 'Bloggs',
        phone: '1234567890',
        households: [{ id: 1, roleId: 1 }]
      });
    }
    return Promise.resolve(null);
  })
}));

const JWT_SECRET = 'so_secret';
const validToken = jwt.sign(
  { userId: 1, email: 'joebloggs@example.com' },
  JWT_SECRET,
  { expiresIn: '5m' }
);

describe('GET /devices/:id/config', () => {
  it('should return 200 and the device config for authenticated user', async () => {
    const res = await request(app)
      .get('/api/v1/devices/1/config')
      .set('Authorization', `Bearer ${validToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', 1);
    expect(res.body).toHaveProperty('config');
    expect(res.body.config).toEqual({ foo: 'bar' });
  });

  it('should return 401 if no token is provided', async () => {
    const res = await request(app).get('/api/v1/devices/1/config');
    expect(res.status).toBe(401);
  });

  it('should return 404 if config not found', async () => {
    const res = await request(app)
      .get('/api/v1/devices/999/config')
      .set('Authorization', `Bearer ${validToken}`);
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error', 'Device config not found');
  });
});

describe('PUT /devices/:id/config', () => {
  it('should upsert and return device config for authenticated user', async () => {
    const config = { foo: 'baz' };
    const res = await request(app)
      .put('/api/v1/devices/1/config')
      .set('Authorization', `Bearer ${validToken}`)
      .send({ config });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', 1);
    expect(res.body).toHaveProperty('config');
    expect(res.body.config).toEqual(config);
  });

  it('should return 401 if no token is provided', async () => {
    const config = { foo: 'baz' };
    const res = await request(app)
      .put('/api/v1/devices/1/config')
      .send({ config });
    expect(res.status).toBe(401);
  });

  it('should return 404 if device not found', async () => {
    const config = { foo: 'baz' };
    // Mock upsertDeviceConfig to return null for this test
    const deviceConfigService = require('../src/services/deviceConfigService');
    deviceConfigService.upsertDeviceConfig.mockResolvedValueOnce(null);
    const res = await request(app)
      .put('/api/v1/devices/999/config')
      .set('Authorization', `Bearer ${validToken}`)
      .send({ config });
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });
});
