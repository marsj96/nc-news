const { getArticleById } = require('../controllers/news.controller')

const articlesRouter = require('express').Router()

articlesRouter.route('/:article_id').get(getArticleById)

module.exports = articlesRouter