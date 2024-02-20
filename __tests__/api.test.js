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
                // expect(Array.isArray(topics)).toBe(true);
                topics.forEach((topic) => {
                    expect(topic).toHaveProperty('description');
                    expect(topic).toHaveProperty('slug');
                    expect(typeof topic.slug).toBe('string');
                    expect(typeof topic.description).toBe('string');
                    });
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

describe('Articles', ()=>{
    describe('/api/articles/:article_id', () => {
        test('GET:200 sends a single article to the client', () => {
            return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then((response) => {
                expect(response.body.article.article_id).toBe(1);
                expect(response.body.article.title).toBe('Living in the shadow of a great man');
                expect(response.body.article.topic).toBe('mitch');
                expect(response.body.article.author).toBe('butter_bridge');
                expect(response.body.article.body).toBe('I find this existence challenging');
                expect(response.body.article.created_at).toBe('2020-07-09T20:11:00.000Z');
                expect(response.body.article.votes).toBe(100);
                expect(response.body.article.article_img_url).toBe('https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700');
            });
        });
        test('GET:404 sends an appropriate status and error message when given a valid but non-existent id', () => {
            return request(app)
                .get('/api/articles/1999')
                .expect(404)
                .then((response) => {
                expect(response.body.msg).toBe('No user found for user_id: 1999');
                });
        });
        test('GET:400 sends an appropriate status and error message when given an invalid id', () => {
            return request(app)
                .get('/api/articles/not-an-id')
                .expect(400)
                .then((response) => {
                expect(response.body.msg).toBe('Bad request');
                });
            });
    })

})



