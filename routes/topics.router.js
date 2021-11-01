const { getTopics } = require('../controllers/news.controller')

const topicsRouter = require('express').Router()

topicsRouter.route('/').get(getTopics)

module.exports = topicsRouter