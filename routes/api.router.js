const articlesRouter = require('./articles.router')
const commentsRouter = require('./comments.router')
const topicsRouter = require('./topics.router')
const { getApi } = require('../controllers/api.controller.js')

const apiRouter = require('express').Router()
   
apiRouter.use('/topics', topicsRouter)
apiRouter.use('/articles', articlesRouter)
apiRouter.use('/comments', commentsRouter)
apiRouter.use('/', getApi)

module.exports = apiRouter