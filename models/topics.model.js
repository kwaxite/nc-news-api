const db = require('../db/connection')

function selectAllTopics(){
    return db.query(`SELECT * FROM topics`)
    .then(response=>{
        return response.rows
    })
}



module.exports = {selectAllTopics}