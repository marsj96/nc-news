const { checkObjectLength, checksSortBy } = require("../utils");
require('jest-sorted');
const db = require('../db/connection.js');
const seed = require('../db/seeds/seed.js');

beforeEach(() => seed(testData));

jest.setTimeout(() => {
    
}, 10000);

describe('Utility functions', () => {
    describe('Check object length', () => {
        it('Should return the length of the passed object into the function', () => {
            const testObj = { name: "Jack", age: 25, language: "Javascript"}
            expect(checkObjectLength(testObj)).toEqual(3)
        });
        
    });
    describe('Checks sort_by query', () => {

        it('Should return an array of article objects sorted by title', () => {
            const sort_by = "title"
            let queryString = 
            `SELECT articles.*,
            COUNT(comments.article_id) AS comment_count
            FROM articles 
            LEFT JOIN comments 
            ON articles.article_id = comments.article_id 
            GROUP BY articles.article_id`

            checksSortBy(sort_by, queryString)
            .then(({rows: articles})=>{
                expect(articles).toBeSortedBy(articles[sort_by])
            })
        });
        
    });
});

afterAll(() => db.end());