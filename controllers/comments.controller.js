const { selectCommentsByArticleId } = require("../models/comments.model");




function getCommentsByArticleID (req, res, next){
    const {article_id} = req.params;
    selectCommentsByArticleId(article_id) 
    .then((comments) =>{
        res.status(200).send({comments})
    })
    .catch((err)=>{
        next(err)
    });
}


module.exports = {getCommentsByArticleID}