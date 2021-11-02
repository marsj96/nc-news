const { fetchTopics, fetchArticleById, changeArticleById, fetchCommentsByArticleId } = require("../models/news.model")

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

exports.getCommentsByArticleId = (req, res, next) => {

    const {article_id: id} = req.params

    fetchCommentsByArticleId(id)
    .then((comments)=>{
        console.log(comments)
    })
}