const db = require('../db/connection')

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