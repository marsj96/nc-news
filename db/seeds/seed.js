const db = require('../connection')

const seed = (data) => {
  const { articleData, commentData, topicData, userData } = data;
  // 1. create tables
  return db.query("DROP TABLE IF EXISTS topics")
  // 2. insert data
};

module.exports = seed;
