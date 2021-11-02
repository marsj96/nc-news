const db = require('../db/connection')
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

exports.fetchArticles = () => {

    return db.query(`
    SELECT articles.*, 
    COUNT(comments.article_id) AS comment_count
    FROM articles 
    LEFT JOIN comments 
    ON articles.article_id = comments.article_id 
    GROUP BY articles.article_id;`)
    .then(({rows})=>{
        return rows
    })

    // //returns an array of all articles from DB and then maps a comment_count = 0 to each object within the array
    // const articlesPromise = db.query(`SELECT * FROM articles`)
    // .then(({rows})=>{
    //     const articleWithCommentsCount = rows.map((article)=>{
    //         return {
    //             article_id: article.article_id,
    //             title: article.title,
    //             body: article.body,
    //             topic: article.topic,
    //             votes: article.votes,
    //             author: article.author,
    //             created_at: article.created_at,
    //             comment_count: 0
    //         }
    //     })
    //     return articleWithCommentsCount
    // })

    // //returns all comments within the DB
    // const commentsPromise = db.query(`SELECT * FROM comments`)
    // .then(({rows})=>{
    //     return rows
    // })

    // const promiseArray = [articlesPromise, commentsPromise]

    // //returns the array of articles with the comment_count includes
    // return Promise.all(promiseArray)
    // .then(([articles, comments])=>{
    //     //iterate through each comment in the array
    //     comments.forEach((comment)=>{
    //         //map to a new array incrementing by +1 each time the article.article_id matches the comment.article_id
    //         articles.map((article)=>{
    //             if(comment.article_id === article.article_id) {
    //                 article.comment_count++
    //             }
    //         })
    //     })
    //     return articles
    // })

}