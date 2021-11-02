const { getArticleById, patchArticleById } = require('../controllers/news.controller')

const articlesRouter = require('express').Router()

articlesRouter.route('/:article_id').get(getArticleById)
articlesRouter.route('/:article_id').patch(patchArticleById)


module.exports = articlesRouter