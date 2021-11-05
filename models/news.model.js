const db = require('../db/connection')
const { checkObjectLength, checksSortBy } = require('../utils')

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

exports.fetchArticles = (sort_by = "created_at", order, filter) => {

    //defines SQL query for use throughout this function
    let articlesQuery = 
    `SELECT articles.*,
    COUNT(comments.article_id) AS comment_count
    FROM articles 
    LEFT OUTER JOIN comments 
    ON articles.article_id = comments.article_id 
    GROUP BY articles.article_id`

    //defines filter query as we will need to place the WHERE condition before the GROUP BY
    let filterQuery = 
    `SELECT articles.*,
    COUNT(comments.article_id) AS comment_count
    FROM articles 
    LEFT JOIN comments 
    ON articles.article_id = comments.article_id 
    WHERE articles.topic = $1
    GROUP BY articles.article_id;`

    //defines accepted terms for sort_by and order
    const validSortBy = ["title", "article_id", "topic", "votes", "comment_count", "created_at", "author"]
    const validOrder = ["ASC", "DESC", "asc", "desc"]

    //checks if the sort_by excists as column within our DB
    if(!validSortBy.includes(sort_by)) {
        return Promise.reject({status: 400, msg: "Bad request"})
    } 
    
    //directs to the sort_by function when no order/filter are passed
    if(!order && !filter) {
        return checksSortBy(sort_by, articlesQuery)
        .then(({rows})=>{
        return rows
        })
    }

    //checks if the passed order is an accepted SQL query
    if(!validOrder.includes(order) && !filter) {
        return Promise.reject({status: 400, msg: "Bad request"})
    }

    //checks for order passed in and queries the database with that order
    if(order === "ASC" || order === "asc" && !filter) {
        return db.query(articlesQuery += ` ORDER BY created_at ASC`)
        .then(({rows})=>{
            return rows
        })
    }
    
    //checks for order passed in and queries the database with that order
    if(order === "DESC" || order === "desc" && !filter) {
        return db.query(articlesQuery += ` ORDER BY created_at DESC`)
        .then(({rows})=>{
            return rows
        })
    }

    //checks for filter passed in and returns the specified topic. If the rows is empty and topic doesn't exist, rejects promise
    if(filter) {
        //returns db query with all articles with matching topic
        return db.query(filterQuery, [filter])
        .then(({rows})=>{
            //checks if the return has a length of 0
            if(rows.length === 0) {
                //checks if the topic passed is within the DB
                return db.query(`SELECT * FROM topics WHERE slug = $1;`, [filter])
                .then(({rows})=>{
                    //if query comes back as undefined, the topic does not any articles related to it
                    if(rows[0] !== undefined) {
                        return {msg: `There are no articles related to this topic, yet!`}
                    } else {
                        //if not, we reject and throw a bad request error as topic does not exist
                        return Promise.reject({status: 400, msg: "Bad request"})
                    }
                })
            }
            //if length is not 0, returns rows (articles related to topic)
        return rows
        })
    }


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
    