const db = require('../db/connection.js');
const { expect } = require('@jest/globals');
const request = require('supertest')
const testData = require('../db/data/test-data/index.js');
require('jest-sorted');
const seed = require('../db/seeds/seed.js');
const app = require('../app');

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
                .then(({body})=>{
                    expect(body.articles).toMatchObject({
                        article_id: expect.any(Number),
                        title: expect.any(String),
                        body: expect.any(String),
                        votes: expect.any(Number),
                        topic: expect.any(String),
                        author: expect.any(String),
                        created_at: expect.any(String),
                        comment_count: expect.any(String)
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
                .expect(200)
                .then(({body})=>{
                    expect(body.articles).toMatchObject({
                        article_id: expect.any(Number),
                        title: expect.any(String),
                        body: expect.any(String),
                        votes: expect.any(Number),
                        topic: expect.any(String),
                        author: expect.any(String),
                        created_at: expect.any(String)
                    })
                    expect(body.articles.votes).toEqual(vote.inc_votes)
                })
            });
            it('Status - 201, Should respond with the article with the decremented vote count', () => {
                const vote = { "inc_votes" : -150 }
                return request(app)
                .patch('/api/articles/4')
                .send(vote)
                .expect(200)
                .then(({body})=>{
                    expect(body.articles).toMatchObject({
                        article_id: expect.any(Number),
                        title: expect.any(String),
                        body: expect.any(String),
                        votes: expect.any(Number),
                        topic: expect.any(String),
                        author: expect.any(String),
                        created_at: expect.any(String)
                    })
                    expect(body.articles.votes).toEqual(vote.inc_votes)
                })
            });
            describe('ERRORS', () => {

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
                it('Status - 200 (patch), Should respond with the original body when passed no request body', () => {
                    const testObj = {}
                    return request(app)
                    .patch('/api/articles/3')
                    .send(testObj)
                    .expect(200)
                    .then(({body})=>{
                        expect(body.articles[0]).toMatchObject({
                            article_id: expect.any(Number),
                            author: expect.any(String),
                            body: expect.any(String),
                            created_at: expect.any(String),
                            title: expect.any(String),
                            topic: expect.any(String),
                            votes: expect.any(Number)
                        })
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
                it('Status - 400 (patch), Should respond with bad request when passed an article_id that does not exist in the DB', () => {
                    return request(app)
                    .get('/api/articles/999')
                    .expect(404)
                    .then(({text})=>{
                        expect(text).toEqual("Not found")
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
                    body.articles.forEach((article)=>{
                        expect(article).toMatchObject({
                            article_id: expect.any(Number),
                            title: expect.any(String),
                            body: expect.any(String),
                            votes: expect.any(Number),
                            topic: expect.any(String),
                            author: expect.any(String),
                            created_at: expect.any(String),
                            comment_count: expect.any(String)
                        })
                    })
                })       
            });
        });
        describe('GET request - with queries (sort_by)', () => {
            it('Status - 200, should respond with an ordered array of objects, ordered default by date', () => {
                return request(app)
                .get('/api/articles')
                .expect(200)
                .then(({body})=>{
                    expect(body.articles).toBeSortedBy(body.articles.created_at)
                })
            });
            it('Status - 200, should respond with an ordered array of objects, ordered by title DESC', () => {
                return request(app)
                .get('/api/articles?sort_by=title')
                .expect(200)
                .then(({body})=>{
                    expect(body.articles).toBeSortedBy(body.articles.title)
                })
            });
            it('Status - 200, should respond with an ordered array of objects, ordered by author DESC', () => {
                return request(app)
                .get('/api/articles?sort_by=author')
                .expect(200)
                .then(({body})=>{
                    const testBody = body.articles[0]
                    expect(testBody.author).toEqual("rogersop")
                    expect(body.articles).toBeSortedBy(body.articles.author)
                })
            });
            it('Status - 200, should respond with an ordered array of objects, ordered by article_id', () => {
                return request(app)
                .get('/api/articles?sort_by=article_id')
                .expect(200)
                .then(({body})=>{
                    expect(body.articles).toBeSortedBy(body.articles.article_id)
                })
            });
            it('Status - 200, should respond with an ordered array of objects, ordered by topic', () => {
                return request(app)
                .get('/api/articles?sort_by=topic')
                .expect(200)
                .then(({body})=>{
                    expect(body.articles).toBeSortedBy(body.articles.topic)
                })
            });
            it('Status - 200, should respond with an ordered array of objects, ordered by votes', () => {
                return request(app)
                .get('/api/articles?sort_by=votes')
                .expect(200)
                .then(({body})=>{
                    expect(body.articles).toBeSortedBy(body.articles.votes)
                })
            });
            it('Status - 200, should respond with an ordered array of objects, ordered by comment_count', () => {
                return request(app)
                .get('/api/articles?sort_by=comment_count')
                .expect(200)
                .then(({body})=>{
                    expect(body.articles).toBeSortedBy(body.articles.comment_count)
                })
            });
            describe('ERRORS', () => {
                it('Status 400, should respond with bad request when passed a sort_by query that is not a valid column', () => {
                    return request(app)
                    .get('/api/articles?sort_by=invalid_column')
                    .expect(400)
                    .then(({text})=>{
                        expect(text).toEqual("Bad request")
                    })
                });
            });
        });
        describe('GET request - with queries (order)', () => {
            it('Status - 200, should respond with an ordered array of objects, ordered by ASC', () => {
                return request(app)
                .get('/api/articles?order=ASC')
                .expect(200)
                .then(({body})=>{
                    expect(body.articles).toBeSortedBy(body.articles.created_at)
                })
            });
            it('Status - 200, should respond with an ordered array of objects, ordered by DESC', () => {
                return request(app)
                .get('/api/articles?order=DESC')
                .expect(200)
                .then(({body})=>{
                    expect(body.articles).toBeSortedBy(body.articles.created_at)
                })
            });
            describe('ERRORS', () => {
                it('Status 400, should respond with bad request when passed a order query that is not a argument', () => {
                    return request(app)
                    .get('/api/articles?order=price')
                    .expect(400)
                    .then(({text})=>{
                        expect(text).toEqual("Bad request")
                    })
                });
            });
        });
        describe('GET request - with queries (filter)', () => {
            it('Status - 200, should respond with an ordered array of objects, filtered by a keyword passed in', () => {
                return request(app)
                .get('/api/articles?filter=cats')
                .expect(200)
                .then(({body: {articles}})=>{
                    expect(articles[0].topic).toEqual("cats")
                })
            });
            it('Status - 200, should respond with an ordered array of objects, filtered by a keyword passed in with each article returned having the topic correct topic value', () => {
                return request(app)
                .get('/api/articles?filter=mitch')
                .expect(200)
                .then(({body: {articles}})=>{
                    expect(articles[0].topic).toEqual("mitch")
                    articles.forEach((article)=>{
                        expect(article.topic).toEqual("mitch")
                    })
                })
            });
            it('Status - 200, should respond with an empty object when topic exists but there are not posts related to it', () => {
                return request(app)
                .get('/api/articles?filter=paper')
                .expect(200)
                .then((body)=>{
                    expect(body.body).toEqual([])
                })
            });
            describe('ERRORS', () => {
                it('Status - 400, should respond with bad request when topic does not exist within DB', () => {
                    return request(app)
                    .get('/api/articles?filter=notAFilter')
                    .expect(404)
                    .then((body)=>{
                        expect(body.res.statusMessage).toEqual("Not Found")
                    })
                });
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
                it('Status - 404, Should respond with status 404 and Not found when passed an article_id that does not exist', () => {
                    return request(app)
                    .get('/api/articles/999/comments')
                    .expect(404)
                    .then(({text})=>{
                        expect(text).toEqual("Not found")
                    })
                });
                it('Status - 400, Should respond with status 404 and bad request when passed an article_id that is not a digit', () => {
                    return request(app)
                    .get('/api/articles/not-a-digit/comments')
                    .expect(400)
                    .then(({text})=>{
                        expect(text).toEqual("Bad request")
                    })
                });
            });
        });
        describe('POST request', () => {
            it('Status 201, should respond with the comment passed as "body" within the article specified', () => {
                const comment = {
                    username: "icellusedkars",
                    body: "My first comment!"
                }
                return request(app)
                .post('/api/articles/2/comments')
                .send(comment)
                .expect(201)
                .then(({body})=>{
                    expect(body).toEqual({username: 'icellusedkars', comment_id: 19, body: 'My first comment!'})
                })
            });
            describe('ERRORS', () => {
                it('Status - 404, should respond with not found when passed invalid user into the request body', () => {
                    const comment = {
                        username: "Not a user",
                        body: "Not gonna work!"
                    }
                    return request(app)
                    .post('/api/articles/2/comments')
                    .send(comment)
                    .expect(404)
                    .then(({text})=>{
                        expect(text).toEqual("Not found")
                    })
                });
                it('Status - 201, ignroed extra properties in request body', () => {
                    const comment = {
                        username: "icellusedkars",
                        body: "My first comment!",
                        extra: "Why am I here?"
                    }
                    return request(app)
                    .post('/api/articles/2/comments')
                    .send(comment)
                    .expect(201)
                    .then(({body})=>{
                        expect(body).toEqual({
                            comment_id: 19,
                            username: "icellusedkars",
                            body: "My first comment!"
                        })
                    })
                });
                it('Status - 400, should respond with bad request when passed not all properties in request body', () => {
                    const comment = {
                        username: "Not a user"

                    }
                    return request(app)
                    .post('/api/articles/2/comments')
                    .send(comment)
                    .expect(400)
                    .then(({text})=>{
                        expect(text).toEqual("Bad request")
                    })
                });
                it('Status - 400, should respond with bad request when passed invalid user article_id', () => {
                    const comment = {
                        username: "icellusedkars",
                        body: "Not gonna work!"
                    }
                    return request(app)
                    .post('/api/articles/999/comments')
                    .send(comment)
                    .expect(404)
                    .then(({text})=>{
                        expect(text).toEqual("Not found")
                    })
                });
            });
        });
    });
    describe('/api/comments/:comment_id', () => {
        describe('DELETE requests', () => {
            it('Status - 204, should remove the comment id passed into the path', () => {
                return request(app)
                .delete('/api/comments/3')
                .expect(204)
            });
        });
        describe('ERRORS', () => {
            it('Status - 404, should return not found when passed an invalid article_id', () => {
                return request(app)
                .delete('/api/comments/444')
                .expect(404)
            });
        });
    });
});

afterAll(() => db.end());
