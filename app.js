const express = require("express");
const { getAllTopics, getApi } = require("./controllers/topics.controller");
const app = express();
app.use(express.json());



app.get("/api/topics", getAllTopics)

app.get("/api", getApi )

module.exports = app;
