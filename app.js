const express = require('express');
const { handles404, handles400, handles500, handlesPSQL } = require('./errors/error.controller');
const app = express();
const apiRouter = require('./routes/api.router');

app.use(express.json());

app.use('/api', apiRouter)

app.all("*", (req, res) => {
    res.status(404).send({error: "Invalid URL"})
})

app.use(handles400)
app.use(handles404)
app.use(handlesPSQL)
app.use(handles500)

module.exports = app