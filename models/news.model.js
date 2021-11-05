const db = require('../db/connection')
const articles = require('../db/data/test-data/articles')
const { checkObjectLength, checksSortBy, checksSortByDesc, checkDB } = require('../utils')

exports.fetchTopics = () => {

    return db.query("SELECT * FROM topics;")
    .then(({rows: topics})=>{
        return topics
    })
}

exports.fetchArticleById = (id) => {

    return db.query(
        `SELECT articles.*,
        COUNT(comments.article_id) AS comment_count
        FROM articles 
        LEFT JOIN comments 
        ON articles.article_id = comments.article_id 
        WHERE articles.article_id = $1
        GROUP BY articles.article_id`, [id])
        .then(({rows})=>{
            if(rows.length === 0) {
                return Promise.reject({status:404, msg: "Not found"})
            } else {
                return rows[0]
            }      
        })

}

exports.changeArticleById = (id, votes) => {

    const inc_votes = votes.inc_votes

    if (Object.keys(votes).length === 0) {
        return db.query(`SELECT * FROM articles WHERE article_id = $1`, [id])
        .then(({rows})=>{
            return rows
        })
    }
    
    //checks if the passed body has the property "inc votes"
    if(!votes.hasOwnProperty("inc_votes")) {
        return Promise.reject({status: 400, msg: "Bad request"})
    }
    
    //checks that the property on inc_votes is a number
    if(typeof inc_votes !== "number") {
        return Promise.reject({status: 400, msg: "Bad request"})
    }

    return db.query(`UPDATE articles SET votes = votes+$1 WHERE article_id = $2 RETURNING *`, [inc_votes, id])
    .then(({rows})=>{
        if(rows.length > 0) {
            return rows[0]
        } else {
            return Promise.reject({status:404, msg: "Not found"})
        }
    })
}

exports.fetchCommentsByArticleId = (id) => {

    //returns the commments when the passed article_id matches the passed id
    return db.query(`SELECT comment_id, votes, created_at, author, body FROM comments WHERE article_id = $1`, [id])
    .then(({rows})=>{
    if(rows.length === 0) {
        return Promise.reject({status:404, msg: "Not found"})
    } else {
        return rows
        } 
    })
}

exports.fetchArticles = (sort_by = "created_at", order = "DESC", filter) => {

    //defines accepted terms for sort_by and order
    const validSortBy = ["title", "article_id", "topic", "votes", "comment_count", "created_at", "author"]
    const validOrder = ["ASC", "DESC", "asc", "desc"]

    // defines SQL query for use throughout this function
    let articlesQuery = 
    `SELECT articles.*,
    COUNT(comments.author) AS comment_count
    FROM articles 
    LEFT JOIN comments 
    ON articles.article_id = comments.article_id`

    //checks if the sort_by or order are valid
    if(!validSortBy.includes(sort_by) || (!validOrder.includes(order))) {
        return Promise.reject({status: 400, msg: "Bad request"})
    } 

    //serves the articles related to the passed filter
    if(filter) {
        return db.query(articlesQuery += ` WHERE articles.topic = $1 GROUP BY articles.article_id;`, [filter])
        .then(({rows})=>{
            if(rows.length === 0) {
                return checkDB(filter)
            } else {
                return rows
            }
        })
    }

    //checks if order is not default value and returns value ASC
    if(order !== "DESC") {
        return db.query(articlesQuery += ` GROUP BY articles.article_id ORDER BY created_at DESC`)
        .then(({rows})=>{
        return rows
    })
    }
    

    //returns the sort_by query, defaulted to DESC order
    return checksSortByDesc(sort_by, articlesQuery)
        .then(({rows})=>{
            return rows
        })
    

}

exports.postComment = (id, body, username) => {

    return db.query(
        `INSERT INTO comments
        (body, votes, author, article_id)
        VALUES
        ($1, 0, $2, $3) RETURNING *`, 
        [body, username, id])
        .then(({rows})=>{
            return rows[0]
        })
}

exports.removeComment = (id) => {

    return db.query(
        `SELECT comment_id FROM comments
        WHERE comment_id = $1`, [id])
    .then(({rows})=>{
        if(rows.length > 0){
            return db.query(
                `DELETE FROM comments
                WHERE comment_id = $1`, [id])
        } else {
            return Promise.reject({status: 404, msg: "Not found"})
        }
    })
}
    