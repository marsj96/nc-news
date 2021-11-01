const commentsRouter = require('express').Router()

commentsRouter.route('/').get()

module.exports = commentsRouter