const db = require('../db/connection')

function selectArticlesById(article_id){
    return db.query
    ('SELECT * FROM articles WHERE article_id = $1;',[article_id])
    .then(({ rows }) => {
        const user = rows[0];
        if (!user) {
            return Promise.reject({
            status: 404,
            msg: `No user found for user_id: ${article_id}`,
            });
        }
        return user;
        })
}


function selectAllArticles(){
    return db.query(`SELECT  articles.author, 
        articles.title, 
        articles.topic, 
        articles.article_id, 
        articles.created_at, 
        articles.votes, 
        articles.article_img_url, 
        COUNT(comments.article_id) :: INT AS comment_count
        FROM articles 
        LEFT JOIN comments ON articles.article_id = comments.article_id
        GROUP BY articles.article_id
        ORDER BY created_at DESC
    ;`)
    .then(response => {
        return response.rows
    })
}

function updateArticlesVoteById(articleId, updateVote){
    return db.query (
        `UPDATE articles
        SET votes = votes + $1
        WHERE article_id = $2 RETURNING * ; `,
        [updateVote.inc_votes, articleId]
        )
        .then(({ rows }) => {
            const user = rows[0];
            if (!user) {
                return Promise.reject({
                status: 404,
                msg: `No user found for user_id: ${articleId}`,
                });
            }
            return user;
            })
}


module.exports = {selectArticlesById, selectAllArticles, updateArticlesVoteById}