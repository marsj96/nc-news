const db = require('../connection')
const format = require('pg-format');

const seed = (data) => {
  const { articleData, commentData, topicData, userData } = data;
  // 1. create tables
    return db.query("DROP TABLE IF EXISTS comments")
  .then(()=>{
    return db.query("DROP TABLE IF EXISTS articles")
  })
  .then(()=>{
    return db.query("DROP TABLE IF EXISTS users")
  })
  .then(()=>{
    return db.query("DROP TABLE IF EXISTS topics")
  })
  .then(()=>{
    return db.query(`
      CREATE TABLE topics (
        slug VARCHAR PRIMARY KEY NOT NULL,
        description VARCHAR(100) NOT NULL
      )`)
  })
  .then(()=>{
    return db.query(`
    CREATE TABLE users (
      username VARCHAR PRIMARY KEY NOT NULL,
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
  .then(()=>{
    const topicQuery = format(`INSERT INTO topics
    (slug, description)
    VALUES
    %L
    RETURNING *;`,
    topicData.map((topic)=>{
      return [
        topic.slug,
        topic.description
      ]
    })
    );
    return db.query(topicQuery)
  })
  .then(()=>{
    const userQuery = format(
      `INSERT INTO users
      (username, avatar_url, name)
      VALUES
      %L
      RETURNING *;`,
      userData.map((user)=>{
        return [
          user.username,
          user.avatar_url,
          user.name
        ]
      })
    )
    return db.query(userQuery)
  })
  .then(()=>{
    const articleQuery = format(`
    INSERT INTO articles
    (title, body, votes, topic, author, created_at)
    VALUES
    %L
    RETURNING *;`,
    articleData.map((article)=>{
      return [
        article.title,
        article.body,
        article.votes,
        article.topic,
        article.author,
        article.created_at
      ]
    })
    )
    return db.query(articleQuery)
  })
  .then(()=>{
    const commentQuery = format(`
    INSERT INTO comments
    (author, article_id, votes, created_at, body)
    VALUES
    %L
    RETURNING *;`,
    commentData.map((comment)=>{
      return [
        comment.author,
        comment.article_id,
        comment.votes,
        comment.created_at,
        comment.body
      ]
    }))
    return db.query(commentQuery)
  })
};

module.exports = seed;
