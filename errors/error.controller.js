const { restart } = require("nodemon")

exports.handles404 = (err, req, res, next) => {
    if (err.status = 404 && err.msg === "Not found") {
        res.status(404).send(err.msg)
    } else {
        next(err)
    }
}

exports.handles400 = (err, req, res, next) => {
    if (err.status === 400 && err.msg === "Bad request") {
        res.status(400).send(err.msg)
    } else {
        next(err)
    }
}

exports.handlesPSQL = (err, req, res, next) => {
    if(err.err === 23503 && err.msg == "Bad request") {
        res.status(400).send(err.msg)
    } else {
        next(err)
    }
}

exports.handles500 = (err, req, res, next) => {
    console.log(err)
    res.status(500).send({msg: "Internal server error"})
}

