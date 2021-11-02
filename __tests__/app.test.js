const db = require('../db/connection.js');
const { expect } = require('@jest/globals');
const request = require('supertest')
const testData = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed.js');
const app = require('../app');
const articles = require('../db/data/test-data/articles.js');
const comments = require('../db/data/test-data/comments.js');

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
            it('Status - 200, Should respond with an article with the correct information from articles table, as well as comment count', () => {
                return request(app)
                .get('/api/articles/2')
                .expect(200)
                .then(({body: {article}})=>{
                    expect(article).toMatchObject({
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
            describe('ERRORS', () => {
                it('Status - 404, Should respond with invalid request when passed an article_id not within our DB', () => {
                    return request(app)
                    .get('/api/articles/999')
                    .expect(404)
                    .then(({text})=>{
                        expect(text).toEqual("Not found")
                    })
                });
                it('Status - 400, Should respond with bad request when passed an article_id that is not a number', () => {
                    return request(app)
                    .get('/api/articles/not-a-number!')
                    .expect(400)
                    .then(({text})=>{
                        expect(text).toEqual("Bad request")
                    })
                });
            });
        });
        describe('PATCH Request', () => {
            it('Status - 201, Should respond with the article with the incremented vote count', () => {
                const vote = { "inc_votes" : 150 }
                return request(app)
                .patch('/api/articles/4')
                .send(vote)
                .expect(201)
                .then(({body: {article}})=>{
                    expect(article).toMatchObject({
                        article_id: expect.any(Number),
                        title: expect.any(String),
                        body: expect.any(String),
                        votes: expect.any(Number),
                        topic: expect.any(String),
                        author: expect.any(String),
                        created_at: expect.any(String)
                    })
                    expect(article.votes).toEqual(vote.inc_votes)
                })
            });
            it('Status - 201, Should respond with the article with the decremented vote count', () => {
                const vote = { "inc_votes" : -150 }
                return request(app)
                .patch('/api/articles/4')
                .send(vote)
                .expect(201)
                .then(({body: {article}})=>{
                    expect(article).toMatchObject({
                        article_id: expect.any(Number),
                        title: expect.any(String),
                        body: expect.any(String),
                        votes: expect.any(Number),
                        topic: expect.any(String),
                        author: expect.any(String),
                        created_at: expect.any(String)
                    })
                    expect(article.votes).toEqual(vote.inc_votes)
                })
            });
            describe('ERRORS', () => {
                it('Status - 400 (patch), Should respond with bad request when passed an object with a length that is not equal to 1', () => {
                    const testObj = {inc_votes: 200, name: "Jack"}
                    return request(app)
                    .patch('/api/articles/3')
                    .send(testObj)
                    .expect(400)
                    .then(({text})=>{
                        expect(text).toEqual("Bad request")
                    })
                });
                it('Status - 400 (patch), Should respond with a bad request when pased an invalid inc_votes value', () => {
                    const testObj = {inc_votes: "not-a-number"}
                    return request(app)
                    .patch('/api/articles/3')
                    .send(testObj)
                    .expect(400)
                    .then(({text})=>{
                        expect(text).toEqual("Bad request")
                    })
                });
                it('Status - 400 (patch), Should respond with bad request when the request body does not contain "inc_votes"', () => {
                    const testObj = {not_inc_votes: 25}
                    return request(app)
                    .patch('/api/articles/3')
                    .send(testObj)
                    .expect(400)
                    .then(({text})=>{
                        expect(text).toEqual("Bad request")
                    })
                });
                it('Status - 400 (patch), Should respond with bad request when passed an article_id that is not a number', () => {
                    return request(app)
                    .get('/api/articles/not-a-number!')
                    .expect(400)
                    .then(({text})=>{
                        expect(text).toEqual("Bad request")
                    })
                });
            });
        });
    }); 
    describe('/api/articles', () => {
        describe('GET request', () => {
            it('Status - 200, should respond with an array of article objects, each with their correct properties, including comment count', () => {
                return request(app)
                .get('/api/articles')
                .expect(200)
                .then(({body})=>{
                    expect(body.articles).toHaveLength(12)
                    expect(body.articles[0].comment_count).toEqual(11)
                    body.articles.forEach((article)=>{
                        expect(article).toMatchObject({
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
                })       
            });
        });
    });
    describe('/api/articles/:article_id/comments', () => {
        describe('GET Request', () => {
            it('Status - 200, Should respond with an array of comments for the given article_id, which each of the corresponding properties for comments', () => {
                return request(app)
                .get('/api/articles/3/comments')
                .expect(200)
                .then(({body})=>{
                    body.comments.forEach((comment)=>{
                        expect(comment).toMatchObject({
                            comment_id: expect.any(Number),
                            author: expect.any(String),
                            votes: expect.any(Number),
                            created_at: expect.any(String),
                            body: expect.any(String)
                        })
                    })
                })
            });
            describe('ERRORS', () => {
                it('Status 404, Should respond with status 404 and Not found when passed an article_id that does not exist', () => {
                    return request(app)
                    .get('/api/articles/999/comments')
                    .expect(404)
                    .then(({text})=>{
                        expect(text).toEqual("Not found")
                    })
                });
                it('Status 400, Should respond with status 404 and bad request when passed an article_id that is not a digit', () => {
                    return request(app)
                    .get('/api/articles/not-a-digit/comments')
                    .expect(400)
                    .then(({text})=>{
                        expect(text).toEqual("Bad request")
                    })
                });
            });
        });
    });
});

afterAll(() => db.end());
