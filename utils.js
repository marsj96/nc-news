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

exports.checksSortBy = (sortByQuery, queryString) => {

    if(sortByQuery === "title") {
        return db.query(queryString += ` ORDER BY title ASC`)
    }

    if(sortByQuery === "article_id") {
        return db.query(queryString += ` ORDER BY article_id ASC`)
    }

    if(sortByQuery === "topic") {
        return db.query(queryString += ` ORDER BY topic ASC`)
    }

    if(sortByQuery === "votes") {
        return db.query(queryString += ` ORDER BY votes DESC`)
    }

    if(sortByQuery === "comment_count") {
        return db.query(queryString += ` ORDER BY comment_count DESC`)
    }

    if(sortByQuery === "created_at") {
        return db.query(queryString += ` ORDER BY comment_count DESC`)
    }
}