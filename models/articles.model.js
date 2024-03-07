const db = require('../db/connection')

function selectArticlesById(article_id, comment_count){
    console.log("from model 1", comment_count)
    console.log("from model 2", article_id)
    const queryVals = [article_id]
    let sqlString = 'SELECT * FROM articles WHERE articles.article_id = $1;'
    if (comment_count){
        sqlString = `SELECT articles.article_id, articles.author, COUNT(comments.comment_id) :: INT AS comment_count 
        FROM articles 
        LEFT JOIN comments ON comments.article_id = articles.article_id
        WHERE articles.article_id = $1
        GROUP BY articles.article_id;`
        
    }
    return db.query(sqlString,queryVals)

   
    // ('SELECT * FROM articles WHERE article_id = $1;',[article_id])
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


function selectAllArticles(category){
    let sqlString = `SELECT  articles.author, 
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
;`
    const queryVals = []
    if (category) {
        sqlString = `SELECT  articles.author, 
        articles.title, 
        articles.topic, 
        articles.article_id, 
        articles.created_at, 
        articles.votes, 
        articles.article_img_url, 
        COUNT(comments.article_id) :: INT AS comment_count
        FROM articles 
        LEFT JOIN comments ON articles.article_id = comments.article_id
        WHERE articles.topic = $1
        GROUP BY articles.article_id
        ORDER BY created_at DESC
    ;`
    queryVals.push(category)
    }
    return db.query(sqlString, queryVals)
    .then(({rows}) => {
        if (rows.length === 0){
            return Promise.reject({
                status: 404,
                msg: `${category} is not a valid category name`,
                });
        }
        return rows
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