const db = require('../db/connection')

function selectAllUsers(){
    return db.query
    (`SELECT * FROM users;`)
    .then(response => {
        return response.rows
    })

}




module.exports = {selectAllUsers}