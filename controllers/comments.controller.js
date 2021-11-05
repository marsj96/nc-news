const { fetchCommentsByArticleId, postComment, removeComment } = require("../models/news.model")

exports.getCommentsByArticleId = (req, res, next) => {

    const {article_id: id} = req.params

    fetchCommentsByArticleId(id)
    .then((comments)=>{
        res.status(200).send({comments})
    })
    .catch(next)
}

exports.sendComment = (req, res, next) => {

    const {article_id: id} = req.params
    const {body, username} = req.body

    postComment(id, body, username)
    .then((comment)=>{
        res.status(201).send({comment_id: comment.comment_id,username: comment.author, body: comment.body})
    })
    .catch(next)
}

exports.deleteComment = (req, res, next) => {

    const {comment_id} = req.params

    removeComment(comment_id)
    .then(()=>{
        res.status(204).send()
    })
    .catch(next)
}

