import handler from '../pages/api/create-checkout-session';
import httpMocks from 'node-mocks-http';

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
    const req = httpMocks.createRequest({ method: 'POST', headers: { origin: 'http://localhost:3000' } });
    const res = httpMocks.createResponse();
    await handler(req, res);
    expect(res.statusCode).toBe(200);
    const data = res._getJSONData();
    expect(data.id).toBe('sess_123');
  });
});