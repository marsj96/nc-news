const { getArticleById, patchArticleById, getCommentsByArticleId, getArticles, sendComment } = require('../controllers/news.controller')

const articlesRouter = require('express').Router()

articlesRouter.route('/').get(getArticles)
articlesRouter.route('/:article_id').get(getArticleById)
articlesRouter.route('/:article_id').patch(patchArticleById)
articlesRouter.route('/:article_id/comments').get(getCommentsByArticleId)
articlesRouter.route('/:article_id/comments').post(sendComment)


module.exports = articlesRouter