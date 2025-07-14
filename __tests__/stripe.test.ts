import '@testing-library/jest-dom';
import { describe, it, expect, jest } from '@jest/globals';
import { createRequest, createResponse } from 'node-mocks-http';
import handler from '../pages/api/create-checkout-session';

jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    checkout: {
      sessions: {
        create: jest.fn().mockResolvedValue({ id: 'sess_123' })
      },
    },
  }));
});

describe('create-checkout-session API', () => {
  it('returns 200 with session id', async () => {
    const req = createRequest({ method: 'POST', headers: { origin: 'http://localhost:3000' } });
    const res = createResponse();
    await handler(req, res);
    expect(res.statusCode).toBe(200);
    const data = res._getJSONData();
    expect(data.id).toBe('sess_123');
  });
});

export {};