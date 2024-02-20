const { selectArticlesById } = require("../models/articles.model");


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

module.exports = {getArticlesById}