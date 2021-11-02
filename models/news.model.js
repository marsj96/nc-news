const db = require('../db/connection')
const { checkObjectLength } = require('../utils')

exports.fetchTopics = () => {
    return db.query("SELECT * FROM topics;")
    .then(({rows: topics})=>{
        return topics
    })
}

exports.fetchArticleById = (id) => {

    if(id.match(/\D/)) {
        return Promise.reject({status: 400, msg: "Bad request"})
    }

    const articlePromise = db.query(`SELECT * FROM articles WHERE article_id = $1`, [id])
    .then(({rows: articles})=>{
        return articles
    })

    const commentCountPromise = db.query(`SELECT * FROM comments WHERE article_id = $1`, [id])
    .then(({rows})=>{
        return rows.length
    })

    const promiseArray = [articlePromise, commentCountPromise]

    return Promise.all(promiseArray)
    .then(([articles, count])=>{
        if(articles.length === 0) {
            return Promise.reject({status:404, msg: "Not found"})
        } else {
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

    //checks that the passed body and id are both digits
    if(id.match(/\D/) || inc_votes.toString().match(/\D/)) {
        return Promise.reject({status: 400, msg: "Bad request"})
    }

    //Selects the article where article id = the id passed into the request
    return db.query(`SELECT FROM articles WHERE article_id = $1`, [id])
    .then(({rows})=>{
    //Checks if the returned body has length (if the article_id exists)
    if(rows.length === 0) {
        return Promise.reject({status:404, msg: "Not found"})
    } else {
    //Returns the entire article with the vote digiti added onto the original votes value
        return db.query(`UPDATE articles SET votes = votes+$1 WHERE article_id = $2 RETURNING *`, [inc_votes, id])
        .then(({rows: article})=>{
            return article[0]
        })
    }
})

    

}