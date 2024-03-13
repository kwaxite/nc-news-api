const cors = require('cors')
const request = require('supertest');
const express = require('express')
const app = express();
const { getAllTopics, getApi} = require("./controllers/topics.controller");
const { getArticlesById, getAllArticles, patchArticlesVotesById } = require('./controllers/articles.controller');
const { getCommentsByArticleID, postComments, deleteCommentByID, updateVotes } = require('./controllers/comments.controller');
const { getUsers } = require('./controllers/users.controller');

app.use(cors());

app.use(express.json());



app.get("/api/topics", getAllTopics)

app.get("/api", getApi )

app.get("/api/articles/:article_id", getArticlesById)
app.get("/api/articles", getAllArticles)

app.post("/api/articles/:article_id/comments",postComments )
app.patch("/api/articles/:article_id", patchArticlesVotesById)

app.get("/api/articles/:article_id/comments", getCommentsByArticleID)
app.patch("/api/comments/:comment_id", updateVotes)

app.delete("/api/comments/:comment_id", deleteCommentByID)

app.get("/api/users", getUsers)

 // handle custom errors
app.use((err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg });
    }
    next(err)
})

// handle specific psql errors
app.use((err, req, res, next)=>{
    if (err.code === '22P02' || err.code === '23502'){
    res.status(400).send({msg:'Bad request'})
    }
        next(err)
    })

app.use((err, req, res, next)=>{
    if (err.code === '23503'){
    res.status(404).send({msg:'Not Found'})
    }
        next(err)
    })

app.use((err, req, res, next)=>{
    // console.log('error in error handling middleware', err)
    res.status(500).send({msg: "Internal server error!"})
})

module.exports = app;
