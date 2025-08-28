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

jest.mock('../src/services/deviceService', () => ({
  createDevice: jest.fn().mockImplementation(device => {
    if (device.householdId === 1) {
      return Promise.resolve({
        id: 1,
        serialNumber: 'ABC123',
        name: 'Some name',
        description: 'Some description',
        firmwareVersion: '',
        householdId: 1,
        deviceTypeId: 1
      });
    }
    return Promise.resolve(null);
  }),
  getDeviceById: jest.fn().mockImplementation(id => {
    if (id === 1) {
      return Promise.resolve({
        id: 1,
        serialNumber: 'ABC123',
        name: 'Some name',
        description: 'Some description',
        firmwareVersion: '',
        householdId: 1,
        deviceTypeId: 1,
        config: {
          foo: 'bar'
        }
      });
    }
    return Promise.resolve(null);
  }),
  deleteDeviceById: jest.fn().mockImplementation(id => {
    if (id === 1) {
      return Promise.resolve({
        id: 1,
        serialNumber: 'ABC123',
        name: 'Some name',
        description: 'Some description',
        firmwareVersion: '',
        householdId: 1,
        deviceTypeId: 1
      });
    }
    return Promise.resolve(null);
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

describe('POST /devices', () => {
  it('should return 401 if no token is provided', async () => {
    const res = await request(app).post('/api/v1/devices').send({
      serialNumber: 'MOCK123',
      name: 'Test Device',
      householdId: 1,
      deviceTypeId: 1
    });
    expect(res.status).toBe(401);
  });

  it('should register a device and return 201', async () => {
    const res = await request(app)
      .post('/api/v1/devices')
      .set('Authorization', `Bearer ${validToken}`)
      .send({
        serialNumber: 'ABC123',
        name: 'Test Device',
        householdId: 1,
        deviceTypeId: 1
      });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id', 1);
    expect(res.body).toHaveProperty('serialNumber', 'ABC123');
  });

  it('should return 403 if user is not part of household', async () => {
    const res = await request(app)
      .post('/api/v1/devices')
      .set('Authorization', `Bearer ${validToken}`)
      .send({
        serialNumber: 'MOCK123',
        name: 'Test Device',
        householdId: 99,
        deviceTypeId: 1
      });
    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty('error', 'User not part of household');
  });

  it('should return 403 if user is guest', async () => {
    jest.resetModules();
    jest.mock('../src/services/userService', () => ({
      getUserById: jest.fn().mockImplementation(id => {
        if (id === 1) {
          return Promise.resolve({
            id: 1,
            email: 'joebloggs@example.com',
            forename: 'Joe',
            surname: 'Bloggs',
            phone: '1234567890',
            households: [{ id: 1, roleId: 3 }]
          });
        }
        return Promise.resolve(null);
      })
    }));

    const appWithMock = require('../src/app').default;
    const res = await request(appWithMock)
      .post('/api/v1/devices')
      .set('Authorization', `Bearer ${validToken}`)
      .send({
        serialNumber: 'MOCK123',
        name: 'Test Device',
        householdId: 1,
        deviceTypeId: 1,
        operatingStatusId: 1
      });
    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty(
      'error',
      'Guest not permitted to register device to household'
    );
  });
});

describe('GET /devices/:id', () => {
  it('should return 200 and the device for authenticated user, including config', async () => {
    const deviceService = require('../src/services/deviceService');
    deviceService.getDeviceById = jest.fn().mockResolvedValue({
      id: 1,
      serialNumber: 'ABC123',
      name: 'Some name',
      description: 'Some description',
      firmwareVersion: '',
      householdId: 1,
      deviceTypeId: 1,
      config: {
        config: '{"foo":"bar"}'
      }
    });
    const res = await request(app)
      .get('/api/v1/devices/1')
      .set('Authorization', `Bearer ${validToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', 1);
    expect(res.body).toHaveProperty('serialNumber', 'ABC123');
    expect(res.body).toHaveProperty('config');
    expect(res.body.config).toEqual({ foo: 'bar' });
  });

  it('should return 401 if no token is provided', async () => {
    const res = await request(app).get('/api/v1/devices/1');
    expect(res.status).toBe(401);
  });

  it('should return 404 if device not found', async () => {
    const res = await request(app)
      .get('/api/v1/devices/999')
      .set('Authorization', `Bearer ${validToken}`);
    expect(res.status).toBe(404);
  });

  it('should return 403 if user not authorised', async () => {
    jest.resetModules();
    jest.mock('../src/services/userService', () => ({
      getUserById: jest.fn().mockImplementation(id => {
        if (id === 1) {
          return Promise.resolve({
            id: 1,
            email: 'joebloggs@example.com',
            forename: 'Joe',
            surname: 'Bloggs',
            phone: '1234567890',
            households: [{ id: 2, roleId: 3 }]
          });
        }
        return Promise.resolve(null);
      })
    }));

    const appWithMock = require('../src/app').default;
    const res = await request(appWithMock)
      .get('/api/v1/devices/1')
      .set('Authorization', `Bearer ${validToken}`);
    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty('error', 'User not authorised');
  });
});

describe('DELETE /devices/:id', () => {
  it('should return 200 when device is deleted successfully', async () => {
    const res = await request(app)
      .delete('/api/v1/devices/1')
      .set('Authorization', `Bearer ${validToken}`)
      .send({ householdId: 1 });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Device deleted successfully');
    expect(res.body).toHaveProperty('id', 1);
    expect(res.body).toHaveProperty('deleted', true);
  });

  it('should return 401 if no token is provided', async () => {
    const res = await request(app).delete('/api/v1/devices/1');
    expect(res.status).toBe(401);
  });

  it('should return 404 if device not found or not part of household', async () => {
    const res = await request(app)
      .delete('/api/v1/devices/999')
      .set('Authorization', `Bearer ${validToken}`)
      .send({ householdId: 1 });
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty(
      'error',
      'Device not found or not part of household'
    );
  });

  it('should return 403 if user not authorised', async () => {
    const res = await request(app)
      .delete('/api/v1/devices/1')
      .set('Authorization', `Bearer ${validToken}`)
      .send({ householdId: 99 });
    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty('error', 'User not part of household');
  });
});
