exports.handles404 = (err, req, res, next) => {
    if (err.status = 404 && err.msg === "Not found") {
        res.status(404).send(err.msg)
    } else {
        next(err)
    }
}

exports.handles200 = (err, req, res, next) => {
    if (err.msg === "Article does not exist") {
        res.status(200).send([])
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
    if(err.code === "23503") {
        res.status(404).send("Not found")
    } else if (err.code === "22P02" || err.code === "23502") {
        res.status(400).send("Bad request")
    } else {
        next(err)
    }
}

exports.handles500 = (err, req, res, next) => {
    res.status(500).send({msg: "Internal server error"})
}

