# Mars

## seed

- Unique constraint not strictly necessary as PRIMARY KEY states it must be unique.
- missing a few `NOT NULL` constraints you might find helpful for error handling
- consider extracting out table creations/drops/insertions into their own functions to tidy things up
- nice and tidy otherwise!


## routes
- nice use of `.route` - don't forget that this allows you to chain on http methods though!
- nice and tidy. Some possible invalid method error handling if you have time?



## controllers
- consider separating you controllers into separate files! if you had 100s of functions you're going to have a bad time navigating this project.
- use this shorthand for creating objects `{topics: topics} === {topics}`
- patch request is sending back the status code 👀
- `sendComment` - I'd like the the freshly post comment id with my response body plz.
- don't see any error handling for `deleteComment` 🥺
- for the `/api` endpoint you don't need to read the file, just require in the JSON. No need for a model 🙌
- in general nice and tidy functions!
- nice destructuring.




## models
- really love the comments!
- nice error handling in `fetchArticleById` consider switching to `.test` though which will give you a boolean instead of an array or null. You're relying on the truthy falsy nature of those values.
- `fetchArticleById` - why are you querying the DB twice to get the comment count? Two connections from the pool are being used up slowing down the server for other users. SQL is designed to be incredibly performant with complex queries such as this. Make use of `JOIN` to get everything you need in one query. Also `commentCountPromise` is over fetching data for the DB. You're asking for EVERYTHING just to count the number of rows. Seems like a waste.
- _checks that the passed body only has 1 property_ error handling you probably don't want! This endpoint is `PATCH /api/article/:article_id`
so you won't necessarily only get one key on the body.
- _checks that the passed id is a digit_ I would let SQL throw this error. Any changes the DB in the future would automatically be handled by the constraints we added to the columns.
- no need for multiple queries in `changeArticleById`. No need to `SELECT` first!
- some error handling missing in your models 👀
- order has default value of `desc`, no?
- `fetchArticles` could be dried up a bit I reckon
- nested `.then` blocks! 🚨



## errors
- `const { restart } = require("nodemon")` ??
- think about invalid method error
- don't forget to remove `console.log` once you're done with it!

## misc
- write your own readme
- remove unnecessary `.md` files
- nice and tidy project though!



## Test Output

Read through all errors. Note that any failing test could be caused by a problem uncovered in a previous test on the same endpoint.

### ESSENTIAL GET `/api/articles?sort_by=author`

Assertion: expected 'butter_bridge' to equal 'rogersop'

Hints:
- accept a `sort_by` query, with a value of any column name
- use `author` for the column to store the username that created the article


### ESSENTIAL GET `/api/articles?topic=mitch`

Assertion: all articles should be by the topic in the query: expected [ Array(12) ] to satisfy [Function]

Hints:
- accept an `topic` query of any topic slug that exists in the database
- use `where` in the model


### ESSENTIAL GET `/api/articles?topic=paper`

Assertion: expected [ Array(12) ] to deeply equal []

Hints:
- give a 200 status and an empty array when articles for a topic that does exist, but has no articles is requested
- use a separate model to check whether the topic exists


### ESSENTIAL GET `/api/articles?topic=not-a-topic`

Assertion: expected 200 to equal 404

Hints:
- use a 404 status code, when provided a non-existent topic
- use a separate model to check whether the topic exists


### ESSENTIAL PATCH `/api/articles/1`

Assertion: expected 201 to equal 200

Hints:
- use a 200: OK status code for successful `patch` requests


### ESSENTIAL PATCH `/api/articles/1`

Assertion: expected 400 to equal 200

Hints:
- ignore a `patch` request with no information in the request body, and send the unchanged article to the client


### ESSENTIAL GET `/api/articles/2/comments`

Assertion: expected 404 to equal 200

Hints:
- return 200: OK when the article exists
- serve an empty array when the article exists but has no comments


### ESSENTIAL POST `/api/articles/1/comments`

Assertion: expected { Object (username, body) } to contain key 'comment'

Hints:
- send the new comment back to the client in an object, with a key of comment: `{ comment: {} }`
- ensure all columns in the comments table match the README


### ESSENTIAL POST `/api/articles/1/comments`

Assertion: Cannot read properties of undefined (reading 'votes')

Hints:
- default `votes` to `0` in the migrations
- default `created_at` to the current time in the migrations


### ESSENTIAL POST `/api/articles/1/comments`

Assertion: expected 201 to equal 400

Hints:
- use a 400: Bad Request status code when `POST` request does not include all the required keys


### ESSENTIAL POST `/api/articles/10000/comments`

Assertion: expected 400 to be one of [ 404, 422 ]

Hints:
- use a 404: Not Found _OR_ 422: Unprocessable Entity status code when `POST` contains a valid article ID that does not exist


### ESSENTIAL POST `/api/articles/1/comments`

Assertion: expected 400 to be one of [ 404, 422 ]

Hints:
- use a 404: Not Found _OR_ 422: Unprocessable Entity status code when `POST` contains a valid username that does not exist


### FURTHER DELETE `/api/comments/1000`

Assertion: expected 204 to equal 404

Hints:
- use a 404: Not Found when `DELETE` contains a valid comment_id that does not exist


# You might find below a helpful tick list!

## Readme - Remove the one that was provided and write your own

- [ ] Link to hosted version
- [ ] Write a summary of what the project is
- [ ] Provide clear instructions of how to clone, install dependencies, seed local database, and run tests
- [ ] Include information about how to create `.env.test` and `.env.development` files
- [ ] Specify minimum versions of `Node.js` and `Postgres` needed to run the project

## General

- [X] Remove any unnecessary `console.logs` and comments
- [ ] Remove all unnecessary files (e.g. old `README.md`, `error-handling.md`, `hosting.md`, `./db/utils/README.md` etc.)
- [X] .gitignore the `.env` files

## Connection to db

- [ ] Throw error if `process.env.PGDATABASE` is not set

## Creating tables

- [ ] Use `NOT NULL` on required fields
- [ ] Default `created_at` in articles and comments tables to the current date:`TIMESTAMP DEFAULT NOW()`
- [ ] Delete all comments when the article they are related to is deleted: Add `ON DELETE CASCADE` to `article_id` column in `comments` table.

## Inserting data

- [ ] Drop tables and create tables in seed function

## Tests

- [ ] Seeding before each test
- [ ] If asserting inside a `forEach`, also has an assertion to check length is at least > 0
- [ ] Ensure all tests are passing
- [ ] Cover all endpoints and errors

- `GET /api/topics`

  - [ ] Status 200, array of topic objects

- `GET /api/articles/:article_id`

  - [ ] Status 200, single article object (including `comment_count`)
  - [ ] Status 400, invalid ID, e.g. string of "not-an-id"
  - [ ] Status 404, non existent ID, e.g. 0 or 9999

- `PATCH /api/articles/:article_id`

  - [ ] Status 200, updated single article object
  - [ ] Status 400, invalid ID, e.g. string of "not-an-id"
  - [ ] Status 404, non existent ID, e.g. 0 or 9999
  - [ ] Status 400, missing / incorrect body, e.g. `inc_votes` property is not a number, or missing

- `GET /api/articles`

  - [ ] Status 200, array of article objects (including `comment_count`, excluding `body`)
  - [ ] Status 200, default sort & order: `created_at`, `desc`
  - [ ] Status 200, accepts `sort_by` query, e.g. `?sort_by=votes`
  - [ ] Status 200, accepts `order` query, e.g. `?order=desc`
  - [ ] Status 200, accepts `topic` query, e.g. `?topic=coding`
  - [ ] Status 400. invalid `sort_by` query, e.g. `?sort_by=bananas`
  - [ ] Status 400. invalid `order` query, e.g. `?order=bananas`
  - [ ] Status 404. non-existent `topic` query, e.g. `?topic=bananas`
  - [ ] Status 200. valid `topic` query, but has no articles responds with an empty array of articles, e.g. `?topic=paper`

- `GET /api/articles/:article_id/comments`

  - [ ] Status 200, array of comment objects for the specified article
  - [ ] Status 400, invalid ID, e.g. string of "not-an-id"
  - [ ] Status 404, non existent ID, e.g. 0 or 9999
  - [ ] Status 200, valid ID, but has no comments responds with an empty array of comments

- `POST /api/articles/:article_id/comments`

  - [ ] Status 201, created comment object
  - [ ] Status 400, invalid ID, e.g. string of "not-an-id"
  - [ ] Status 404, non existent ID, e.g. 0 or 9999
  - [ ] Status 400, missing required field(s), e.g. no username or body properties
  - [ ] Status 404, username does not exist
  - [ ] Status 201, ignores unnecessary properties

- `GET /api`

  - [ ] Status 200, JSON describing all the available endpoints

## Routing

- [ ] Split into api, topics, users, comments and articles routers
- [ ] Use `.route` for endpoints that share the same path

## Controllers

- [ ] Name functions and variables well
- [ ] Add catch blocks to all model invocations (and don't mix use of`.catch(next);` and `.catch(err => next(err))`)

## Models

- Protected from SQL injection
  - [ ] Using parameterized queries for values in `db.query` e.g `$1` and array of variables
  - [ ] Sanitizing any data for tables/columns, e.g. greenlisting when using template literals or pg-format's `%s`
- [ ] Consistently use either single object argument _**or**_ multiple arguments in model functions
- [ ] Use `LEFT JOIN` for comment counts

## Errors

- [ ] Use error handling middleware functions in app and extracted to separate directory/file
- [ ] Consistently use `Promise.reject` in either models _**OR**_ controllers

## Extra Tasks - To be completed after hosting

- `DELETE /api/comments/:comment_id`

- [ ] Status 204, deletes comment from database
- [ ] Status 404, non existant ID, e.g 999
- [ ] Status 400, invalid ID, e.g "not-an-id"

- `GET /api/users`

- [ ] Status 200, responds with array of user objects

- `GET /api/users/:username`

- [ ] Status 200, responds with single user object
- [ ] Status 404, non existant ID, e.g 999
- [ ] Status 400, invalid ID, e.g "not-an-id"

- `PATCH /api/comments/:comment_id`

  - [ ] Status 200, updated single comment object
  - [ ] Status 400, invalid ID, e.g. string of "not-an-id"
  - [ ] Status 404, non existent ID, e.g. 0 or 9999
  - [ ] Status 400, missing / incorrect body, e.g. `inc_votes` property is not a number, or missing

## Extra Advanced Tasks

### Easier

- [ ] Patch: Edit an article body
- [ ] Patch: Edit a comment body
- [ ] Patch: Edit a user's information
- [ ] Get: Search for an article by title
- [ ] Post: add a new user

### Harder

- [ ] Protect your endpoints with JWT authorization. We have notes on this that will help a bit, _but it will make building the front end of your site a little bit more difficult_
- [ ] Get: Add functionality to get articles created in last 10 minutes
- [ ] Get: Get all articles that have been liked by a user. This will require an additional junction table.
- [ ] Research and implement online image storage or random generation of images for topics
