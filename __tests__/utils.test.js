const { checkDB, checksSortByDesc } = require("../utils");
require('jest-sorted');
const { expect } = require('@jest/globals');
const db = require('../db/connection.js');
const seed = require('../db/seeds/seed.js');
const testData = require('../db/data/test-data/index.js');
const request = require('supertest')
const app = require("../app");

beforeEach(() => seed(testData));

describe('Utility functions', () => {
    describe('checkDB', () => {
        it('Queries DB to check if topic exists but only when there is no articles related to it', () => {
            const test = "paper"
            return request(app)
            .get('/api/articles?filter=paper')
            .expect(200)
            .then((rows)=>{
                expect(rows.text).toEqual("Article does not exist")
            })
        });
        it('Queries DB to check if topic exists but only when there is no articles related to it', () => {
            const test = "paper"
            return request(app)
            .get('/api/articles?filter=notvalid')
            .expect(404)
            .then((rows)=>{
                expect(rows.text).toEqual("Not found")
            })
        });
        
    });
    describe('checkSortedByDesc', () => {
        it('Takes a sort_by query and outputs the correct db query', () => {
            const sort_by = "author"
            return request(app)
            .get(`/api/articles?sort_by=${sort_by}`)
            .expect(200)
            .then((rows)=>{
                expect(rows.body.articles).toBeSortedBy(rows.body.articles[sort_by])
            })
        });
    });
});

afterAll(() => db.end());