const { fetchTopics, fetchArticleById } = require("../models/news.model")

exports.getTopics = (req, res, next) => {
    fetchTopics()
    .then((topics)=>{
        res.status(200).send({topics: topics})
    })
}

exports.getArticleById = (req, res, next) => {

    const {article_id: id} = req.params

    fetchArticleById(id)
    .then((articles)=>{
        res.status(200).send({articles: articles})
    })
    .catch(next)
}