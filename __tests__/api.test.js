const request = require("supertest");
const app = require("../app")
const seed = require("../db/seeds/seed")
const testData = require("../db/data/test-data/index")
const db = require("../db/connection");
const { selectAllTopics } = require("../models/topics.model");
const endPointsJson=require("../endpoints.json") 

beforeEach(() => {return seed(testData);});
afterAll(() => {db.end();});

describe("Topics", ()=>{
    describe("GET /api/topics", ()=>{
        test("app connects to the server", () => {
            return request(app).get("/api/topics").expect(200);
        })
        test("returns an array of topic objects with properties: slug, description", ()=>{
            return request(app)
            .get("/api/topics")
            .expect(200)
            .then((response) => {
                const topics = response.body.topics;
                expect(topics.length).toBe(3);
                expect(Array.isArray(topics)).toBe(true);
            })
        })
    })
})

describe("GET /api", ()=>{
    test ("responds with object describing all the available endpoints on your APi", ()=>{
        return request(app).get("/api").expect(200)
        
        .then((response) =>{
            
            const appJsonData = response.body
            expect(appJsonData).toEqual(endPointsJson)
        })
    })
})



