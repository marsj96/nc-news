const articlesRouter = require('express').Router()

articlesRouter.route('/').get()

module.exports = articlesRouter