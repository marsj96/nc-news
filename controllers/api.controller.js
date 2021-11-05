const { fetchApi } = require("../models/news.model")

exports.getApi = (req, res, next) => {
    fetchApi()
    .then((apiJson)=>{
        res.status(200).send(apiJson)
    })
}