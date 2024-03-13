const db = require("../db/connection");

function selectCommentsByArticleId(article_id) {
    return db
        .query(
            `SELECT * FROM comments 
                    WHERE comments.article_id = $1
                    ORDER BY created_at DESC;`,
            [article_id]
        )
        .then(({ rows }) => {
            const comment = rows;
            if (!comment) {
                return Promise.reject({
                    status: 404,
                    msg: `No comments found for article_id: ${article_id}`,
                });
            }
            return comment;
        });
}

function insertComment(comment, articleId) {
    return db
        .query(
            `INSERT INTO comments 
            (body, author, article_id, votes) 
                    VALUES ($1, $2, $3, $4) RETURNING *;`,
            [comment.body, comment.username, articleId, comment.votes]
        )
        .then((result) => {
            return result.rows[0];
        });
}

function deleteCommentByCommentId(commentId) {
    return db
        .query(
            `DELETE FROM comments
        WHERE article_id = $1
        RETURNING *`,
            [commentId]
        )
        .then(({ rows }) => {
            const comment = rows[0];
            if (!comment) {
                return Promise.reject({
                    status: 404,
                    msg: `No comment found for comment_id: ${commentId}`,
                });
            }
            return comment;
        });
}

function updateDBVotes(inc_votes, comment_id) {
    return db.query(
        `UPDATE comments 
        SET votes = votes + $1
        WHERE comment_id = $2
        RETURNING *;`, [inc_votes, comment_id]
    )
        .then(({ rows }) => {

            const comment = rows[0];
            if (!comment) {
                return Promise.reject({
                    status: 404,
                    msg: `No comment found for comment_id: ${comment_id}`,
                });
            }
            return comment;
        });
}
module.exports = {
    selectCommentsByArticleId,
    insertComment,
    deleteCommentByCommentId,
    updateDBVotes,
};
