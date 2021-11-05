const db = require('./db/connection')

exports.checkObjectLength = (obj) => {
    let length = 0;

    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            length++
        }
    }
    return length
}

exports.checksSortByDesc = (sortByQuery, queryString) => {

    if(sortByQuery === "title") {
        return db.query(queryString += ` GROUP BY articles.article_id ORDER BY title DESC`)
    }

    if(sortByQuery === "article_id") {
        return db.query(queryString += ` GROUP BY articles.article_id ORDER BY article_id DESC`)
    }

    if(sortByQuery === "topic") {
        return db.query(queryString += ` GROUP BY articles.article_id ORDER BY topic DESC`)
    }

    if(sortByQuery === "votes") {
        return db.query(queryString += ` GROUP BY articles.article_id ORDER BY votes DESC`)
    }

    if(sortByQuery === "comment_count") {
        return db.query(queryString += ` GROUP BY articles.article_id ORDER BY comment_count DESC`)
    }

    if(sortByQuery === "created_at") {
        return db.query(queryString += ` GROUP BY articles.article_id ORDER BY created_at DESC`)
    }

    if(sortByQuery === "author") {
        return db.query(queryString += ` GROUP BY articles.article_id ORDER BY author DESC`)
    }
}

exports.checksSortByAsc = (sortByQuery, queryString) => {

    if(sortByQuery === "created_at") {
        return db.query(queryString += ` GROUP BY articles.article_id ORDER BY created_at ASC`)
    }

}

exports.checkDB = (filter) => {
    
   return db.query(`SELECT * FROM topics WHERE slug = $1`, [filter])
   .then(({rows})=>{
       if(rows.length === 0) {
           return Promise.reject({status:404, msg: "Not found"})
       } else {
           return Promise.reject({status:200, msg: "Article does not exist"})
       }
   })

}