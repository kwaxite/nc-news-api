const { selectAllTopics } = require("../models/topics.model")


function getAllTopics(req, res){
    console.log(selectAllTopics)
    return selectAllTopics()
    .then((topics) =>{
        res.status(200).send({topics})
    })
    .catch((err) =>{
        res.status(500).send({msg:"Error whilst fetching parks data"})
    })
}



module.exports = {getAllTopics}