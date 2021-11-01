const db = require('../db/connection.js');
const { expect } = require('@jest/globals');
const request = require('supertest')
const testData = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed.js');
const app = require('../app')

beforeEach(() => seed(testData));

describe('APP', () => {
    describe('/api/topics - GET', () => {
        it('Status - 200, should respond with an array of objects containing "slug" and "description"', () => {
            return request(app)
            .get('/api/topics')
            .expect(200)
            .then(({body: {topics}})=>{
                topics.forEach((topic)=>{
                    expect(topic).toMatchObject({
                        slug: expect.any(String),
                        description: expect.any(String)
                    })
                })
            })
        });
    });
});

afterAll(() => db.end());
