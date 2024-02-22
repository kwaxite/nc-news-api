const { selectCommentsByArticleId, insertComment } = require("../models/comments.model");




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

function postComments(req, res, next){
    const newComment = req.body;
    const articleId = req.params.article_id;
    if (newComment.votes === undefined) {
        newComment.votes = 0;
        }
    return  insertComment(newComment, articleId)
    .then((comment) => {
        res.status(201).send({ comment });
        })
        .catch((err)=>{
        next(err)
    })
    }



module.exports = {getCommentsByArticleID, postComments}