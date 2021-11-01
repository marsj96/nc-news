const topicsRouter = require('express').Router()

topicsRouter.route('/').get()

module.exports = topicsRouter