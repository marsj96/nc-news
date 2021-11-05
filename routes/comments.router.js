const { deleteComment } = require('../controllers/comments.controller')

const commentsRouter = require('express').Router()

commentsRouter.route('/').get()
commentsRouter.route('/:comment_id').delete(deleteComment)

module.exports = commentsRouter