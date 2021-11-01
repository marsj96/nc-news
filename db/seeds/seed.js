const db = require('../connection')

const seed = (data) => {
  const { articleData, commentData, topicData, userData } = data;
  // 1. create tables
    return db.query("DROP TABLE IF EXISTS topics")
  .then(()=>{
    return db.query("DROP TABLE IF EXISTS users")
  })
  .then(()=>{
    return db.query("DROP TABLE IF EXISTS articles")
  })
  .then(()=>{
    return db.query("DROP TABLE IF EXISTS comments")
  })
  .then(()=>{
    return db.query(`
      CREATE TABLE topics (
        slug VARCHAR PRIMARY KEY NOT NULL UNIQUE,
        description VARCHAR(100) NOT NULL
      )`)
  })
  .then(()=>{
    return db.query(`
    CREATE TABLE users (
      username VARCHAR PRIMARY KEY NOT NULL UNIQUE,
      avatar_URL VARCHAR,
      name VARCHAR NOT NULL
    )`)
  })
  .then(()=>{
    return db.query(`
      CREATE TABLE articles (
        article_id SERIAL PRIMARY KEY,
        title VARCHAR NOT NULL,
        body VARCHAR NOT NULL,
        votes INT DEFAULT 0,
        topic VARCHAR REFERENCES topics(slug),
        author VARCHAR REFERENCES users(username),
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `)
  })
  .then(()=>{
    return db.query(`
      CREATE TABLE comments (
        comment_id SERIAL PRIMARY KEY,
        author VARCHAR REFERENCES users(username),
        article_id INT REFERENCES articles(article_id),
        votes INT DEFAULT 0,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        body VARCHAR NOT NULL
      )
    `)
  })
  // 2. insert data
};

module.exports = seed;
