const { selectArticlesById, selectAllArticles } = require("../models/articles.model");


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
    return selectAllArticles()
    .then((articles) =>{
        console.log('controller', articles)
        res.status(200).send({articles})
    })
    .catch((err) =>{
        res.status(500).send({msg:"Error whilst fetching articles data"})
    })
}

module.exports = {getArticlesById, getAllArticles}