import request from 'supertest';
import app from '../app.js'; // 확장자 .js를 추가

describe('Health API', () => {
    test('GET /health should return status UP', async () => {
        const response = await request(app).get('/health');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('status', 'UP');
    });

    test('GET /detailed-health should return detailed status UP', async () => {
        const response = await request(app).get('/detailed-health');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('status', 'UP');
        expect(response.body.services).toHaveProperty('database', 'UP');
    });
});
