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

function insertComment (comment, articleId) {
        return db
        .query(
            `INSERT INTO comments 
            (body, author, article_id, votes) 
                    VALUES ($1, $2, $3, $4) RETURNING *;`,
                    [comment.body, comment.username,articleId, comment.votes]
        )
        .then((result) => {
            return result.rows[0];
        })
    };

module.exports = {selectCommentsByArticleId, insertComment}

