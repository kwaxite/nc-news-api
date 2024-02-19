const { selectAllTopics } = require("../models/topics.model")
const endpoints = require("../endpoints.json")
const fs = require("fs/promises");


function getAllTopics(req, res){
    return selectAllTopics()
    .then((topics) =>{
        res.status(200).send({topics})
    })
    .catch((err) =>{
        res.status(500).send({msg:"Error whilst fetching topics data"})
    })
}



function getApi(req, res){
    fs.readFile('endpoints.json')
    .then((data)=>{
        const parsedData = JSON.parse(data)
        return parsedData
    })
    .then((endpoints) =>{
        return res.status(200).send(endpoints)
    })
    .catch((err) =>{
        res.status(500).send({msg:"Error whilst reading json file"})
    })
}

module.exports = {getAllTopics, getApi}