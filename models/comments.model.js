const db = require('../db/connection')

function selectCommentsByArticleId(article_id){
        return db
            .query(`SELECT * FROM comments 
                    WHERE comments.article_id = $1
                    ORDER BY created_at DESC;`, [
                article_id
                ])
            .then(({ rows }) => {
                const comment = rows;
                if (!comment) {
                    return Promise.reject({
                    status: 404,
                    msg: `No comments found for article_id: ${article_id}`,
                    });
                }
                return comment;
                })
}

module.exports = {selectCommentsByArticleId}

// /api/articles/:article_id/comments