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