const { fetchApi, fetchArticleById, changeArticleById, fetchArticles } = require("../models/news.model")

exports.getApi = (req, res, next) => {
    fetchApi()
    .then((apiJson)=>{
        res.status(200).send(apiJson)
    })
}

exports.getArticles = (req, res, next) => {

    const {sort_by, order, filter} = req.query

    fetchArticles(sort_by, order, filter)
    .then((articles)=>{
        res.status(200).send({articles})
    })
    .catch(next)
}

exports.getArticleById = (req, res, next) => {

    const {article_id: id} = req.params

    fetchArticleById(id)
    .then((articles)=>{
        res.status(200).send({articles})
    })
    .catch(next)
}

exports.patchArticleById = (req, res, next) => {

    const {article_id: id} = req.params
    
    const inc_votes = req.body

    changeArticleById(id, inc_votes)
    .then((articles)=>{
        res.status(200).send({articles})
    })
    .catch(next)
}