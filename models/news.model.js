const db = require('../db/connection')
const { sort } = require('../db/data/test-data/articles')
const articles = require('../db/data/test-data/articles')
const comments = require('../db/data/test-data/comments')
const articlesRouter = require('../routes/articles.router')
const { checkObjectLength } = require('../utils')

exports.fetchTopics = () => {
    return db.query("SELECT * FROM topics;")
    .then(({rows: topics})=>{
        return topics
    })
}

exports.fetchArticleById = (id) => {

    //checks if the id passed is a digit
    if(id.match(/\D/)) {
        return Promise.reject({status: 400, msg: "Bad request"})
    }

    //creates a promise for the query to return the article matching the passed id
    const articlePromise = db.query(`SELECT * FROM articles WHERE article_id = $1`, [id])
    .then(({rows: articles})=>{
        return articles
    })

    //creates a promise for the query to return the comments matching the passed id
    const commentCountPromise = db.query(`SELECT * FROM comments WHERE article_id = $1`, [id])
    .then(({rows})=>{
        return rows.length
    })

    //creates an array to pass into the below Promise.all
    const promiseArray = [articlePromise, commentCountPromise]

    //once the above promises have returned returns the value
    return Promise.all(promiseArray)
    //destructures the returned array into articles and count
    .then(([articles, count])=>{
        if(articles.length === 0) {
            return Promise.reject({status:404, msg: "Not found"})
        } else {
            //adds the property comment_count to the article that has been returned
            articles[0].comment_count = count
            return articles[0]
        }      
    })
}

exports.changeArticleById = (id, votes) => {

    const inc_votes = votes.inc_votes

    //checks if the passed body has the property "inc votes"
    if(!votes.hasOwnProperty("inc_votes")) {
        return Promise.reject({status: 400, msg: "Bad request"})
    }
    
    //checks that the passed body only has 1 property
    if(checkObjectLength(votes) != 1){
        return Promise.reject({status: 400, msg: "Bad request"})
    }
    
    //checks that the property on inc_votes is a number
    if(typeof inc_votes !== "number") {
        return Promise.reject({status: 400, msg: "Bad request"})
    }

    //checks that the passed id is a digit
    if(id.match(/\D/)) {
        return Promise.reject({status: 400, msg: "Bad request"})
    }

    //selects the article where article id = the id passed into the request
    return db.query(`SELECT FROM articles WHERE article_id = $1`, [id])
    .then(({rows})=>{
    //checks if the returned body has length (if the article_id exists)
    if(rows.length === 0) {
        return Promise.reject({status:404, msg: "Not found"})
    } else {
    //returns the entire article with the vote digiti added onto the original votes value
        return db.query(`UPDATE articles SET votes = votes+$1 WHERE article_id = $2 RETURNING *`, [inc_votes, id])
        .then(({rows: article})=>{
            return article[0]
        })
    }
})

    

}

exports.fetchCommentsByArticleId = (id) => {

    //checks that the passed id is a digit
    if(id.match(/\D/)) {
        return Promise.reject({status: 400, msg: "Bad request"})
    }

    //returns the commments when the passed article_id matches the passed id
    return db.query(`SELECT * FROM comments WHERE article_id = $1`, [id])
    .then(({rows})=>{

    //checks if the rows returned has a length of greater than  0, if not the article does not have any comments/does not exists
    if(rows.length === 0) {
        return Promise.reject({status:404, msg: "Not found"})
    } else {
        //iterates through each of the comments to take out the article_id
        const commentArr = rows.map((comment)=>{
            return {
                comment_id: comment.comment_id,
                author: comment.author,
                votes: comment.votes,
                created_at: comment.created_at,
                body: comment.body
            }
        })
        return commentArr
        } 
    })
}

exports.fetchArticles = (sort_by) => {

    let articlesQuery = 
    `SELECT articles.*,
    COUNT(comments.article_id) AS comment_count
    FROM articles 
    LEFT JOIN comments 
    ON articles.article_id = comments.article_id 
    GROUP BY articles.article_id`

    if(sort_by === "title") {
        return db.query(articlesQuery += ` ORDER BY title ASC`)
        .then(({rows})=>{
            return rows
        })
    }

    if(sort_by === "article_id") {
        return db.query(articlesQuery += ` ORDER BY article_id ASC`)
        .then(({rows})=>{
            return rows
        })
    }

    if(sort_by === "topic") {
        return db.query(articlesQuery += ` ORDER BY topic ASC`)
        .then(({rows})=>{
            return rows
        })
    }

    if(sort_by === "votes") {
        return db.query(articlesQuery += ` ORDER BY votes ASC`)
        .then(({rows})=>{
            return rows
        })
    }

    if(sort_by === "comment_count") {
        return db.query(articlesQuery += ` ORDER BY comment_count ASC`)
        .then(({rows})=>{
            return rows
        })
    }

    //handles sort_by default to be created_at DESC, so newest posts first unless specified differentl in the query
    if(!sort_by) {
        return db.query(articlesQuery += ` ORDER BY created_at DESC`)
        .then(({rows})=>{
            return rows
        })
    }
}