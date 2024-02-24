const { selectArticlesById, selectAllArticles, updateArticlesVoteById } = require("../models/articles.model");


function getArticlesById(req, res, next){
    const {article_id} = req.params;
    selectArticlesById(article_id) 
    .then((article) =>{
        res.status(200).send({article})
    })
    .catch((err)=>{
        next(err)
    });
}

function getAllArticles(req, res, next){
    const {topic} = req.query
    return selectAllArticles(topic)
    .then((articles) =>{
        res.status(200).send({articles})
    })
    .catch((err)=>{
        next(err)
    });
}

function patchArticlesVotesById(req, res, next){
    const {article_id} = req.params;
    const voteUpdateValue = req.body;
    return updateArticlesVoteById(article_id,voteUpdateValue )
    .then((updateInfo) =>{
        res.status(200).send(updateInfo)
    })
    .catch((err)=>{
        next(err)
    });
}
module.exports = {getArticlesById, getAllArticles,patchArticlesVotesById}