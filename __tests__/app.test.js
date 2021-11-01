const db = require('../db/connection.js');
const { expect } = require('@jest/globals');
const request = require('supertest')
const testData = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed.js');
const app = require('../app');
const articles = require('../db/data/test-data/articles.js');

beforeEach(() => seed(testData));

describe('APP', () => {
    describe('/', () => {
            it('Status - 404, Should respond with invalid url when passed an incorrect URL', () => {
                return request(app)
                .get('/bad-path')
                .expect(404)
                .then(({body})=>{
                    expect(body.error).toEqual("Invalid URL")
                })
            });
        
    });
    describe('/api/topics', () => {
        describe('GET Request', () => {
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
    describe('/api/articles/:article_id', () => {
        describe('GET Request', () => {
            it('Status - 200, Should respond with an article with information from articles table, as well as comment count', () => {
                return request(app)
                .get('/api/articles/2')
                .expect(200)
                .then(({body: {articles}})=>{
                    expect(articles).toMatchObject({
                        article_id: expect.any(Number),
                        title: expect.any(String),
                        body: expect.any(String),
                        votes: expect.any(Number),
                        topic: expect.any(String),
                        author: expect.any(String),
                        created_at: expect.any(String),
                        comment_count: expect.any(Number)
                    })
                    
                })
            });
        });
        describe('ERRORS', () => {
            it('Status - 404, Should respond with invalid request when passed an article_id not within our DB', () => {
                return request(app)
                .get('/api/articles/999')
                .expect(404)
                .then(({text})=>{
                    expect(text).toEqual("Not found")
                })
            });
            it('Status - 400, Should respond with bad request when passed an article_id as a character instead of a number', () => {
                return request(app)
                .get('/api/articles/bad-request')
                .expect(400)
                .then(({text})=>{
                    expect(text).toEqual("Bad request")
                })
            });
        });
        });    
    
});

afterAll(() => db.end());
