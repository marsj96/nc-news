const { fetchTopics, fetchArticleById, changeArticleById } = require("../models/news.model")
const { checkObjectLength } = require("../utils")

exports.getTopics = (req, res, next) => {
    fetchTopics()
    .then((topics)=>{
        res.status(200).send({topics: topics})
    })
    .catch(next)
}

exports.getArticleById = (req, res, next) => {

    const {article_id: id} = req.params

    fetchArticleById(id)
    .then((articles)=>{
        res.status(200).send({article: articles})
    })
    .catch(next)
}

exports.patchArticleById = (req, res, next) => {

    const {article_id: id} = req.params
    
    const inc_votes = req.body

    changeArticleById(id, inc_votes)
    .then((article)=>{
        res.status(201).send({article: article})
    })
    .catch(next)
}