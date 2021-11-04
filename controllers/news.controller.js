const { fetchTopics, fetchArticleById, changeArticleById, fetchCommentsByArticleId, fetchArticles, postComment, removeComment, fetchApi } = require("../models/news.model")

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
        res.status(200).send({comments: comments})
    })
    .catch(next)
}

exports.getArticles = (req, res, next) => {

    const {sort_by, order, filter} = req.query

    fetchArticles(sort_by, order, filter)
    .then((articles)=>{
        res.status(200).send({articles: articles})
    })
    .catch(next)
}

exports.sendComment = (req, res, next) => {

    const {article_id: id} = req.params
    const {body, username} = req.body

    postComment(id, body, username)
    .then((comment)=>{
        res.status(201).send({username: comment.author, body: comment.body})
    })
    .catch(next)
}

exports.deleteComment = (req, res, next) => {

    const {comment_id} = req.params

    removeComment(comment_id)
    .then(()=>{
        res.status(204).send()
    })
}

exports.getApi = (req, res, next) => {
    fetchApi()
    .then((apiJson)=>{
        res.status(200).send(apiJson)
    })
}