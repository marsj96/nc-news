const { getArticleById, patchArticleById, getCommentsByArticleId, getArticles } = require('../controllers/news.controller')

const articlesRouter = require('express').Router()

articlesRouter.route('/').get(getArticles)
articlesRouter.route('/:article_id').get(getArticleById)
articlesRouter.route('/:article_id').patch(patchArticleById)
articlesRouter.route('/:article_id/comments').get(getCommentsByArticleId)


module.exports = articlesRouter