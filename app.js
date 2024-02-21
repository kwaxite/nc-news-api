const request = require('supertest');
const express = require('express')
const app = express();
const { getAllTopics, getApi} = require("./controllers/topics.controller");
const { getArticlesById, getAllArticles } = require('./controllers/articles.controller');
const { getCommentsByArticleID } = require('./controllers/comments.controller');

app.use(express.json());



app.get("/api/topics", getAllTopics)

app.get("/api", getApi )

app.get("/api/articles/:article_id", getArticlesById)
app.get("/api/articles", getAllArticles)

app.get("/api/articles/:article_id/comments", getCommentsByArticleID)

 // handle custom errors
app.use((err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg });
    }
    next(err)
})

// handle specific psql errors
app.use((err, req, res, next)=>{
    if (err.code === '22P02'){
    res.status(400).send({msg:'Bad request'})
    }
        next(err)
    })

app.use((err, req, res, next)=>{
    console.log('error in error handling middleware', err)
    res.status(500).send({msg: "Internal server error!"})
})

module.exports = app;
