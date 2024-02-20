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

module.exports = {selectArticlesById}