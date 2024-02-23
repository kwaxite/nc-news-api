const request = require("supertest");
const app = require("../app")
const seed = require("../db/seeds/seed")
const testData = require("../db/data/test-data/index")
const db = require("../db/connection");
const endPointsJson=require("../endpoints.json") 
require('jest-sorted')

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
                topics.forEach((topic) => {
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
    describe('GET /api/articles', ()=>{
        test("returns an array of article objects with correct properties", ()=>{
            return request(app)
            .get("/api/articles")
            .expect(200)
            .then((response) => {
                const articles = response.body.articles;
                articles.forEach((article) => {
                    expect(typeof article.author).toBe('string');
                    expect(typeof article.title).toBe('string');
                    expect(typeof article.article_id).toBe('number');
                    expect(typeof article.topic).toBe('string');
                    expect(typeof article.created_at).toBe('string');
                    expect(typeof article.votes).toBe('number');
                    expect(typeof article.article_img_url).toBe('string');
                    expect(typeof article.comment_count).toBe('number');
                    });
            })
        })
        test("the articles should be sorted by date in descending order", ()=>{
            return request(app)
            .get("/api/articles")
            .expect(200)
            .then((response) => {
                const articles = response.body.articles;
                expect(Array.isArray(articles)).toBe(true);
                expect(articles).toBeSorted({ created_at: 'id' })
            })
        })
    })
})

describe ("/api/articles/:article_id/comments", ()=>{
    test('GET:200 sends an array of comments for the given article_id for each comment', () => {
        return request(app)
            .get('/api/articles/1/comments')
            .expect(200)
            .then((response) => {
            expect(response.body.comments.length).toBe(11);
            response.body.comments.forEach((comment) => {
                expect(typeof comment.comment_id).toBe('number');
                expect(typeof comment.votes).toBe('number');
                expect(typeof comment.created_at).toBe('string');
                expect(typeof comment.author).toBe('string');
                expect(typeof comment.body).toBe('string');
                expect(typeof comment.article_id).toBe('number');
                expect(comment.article_id).toBe(1);
            });
            });
        });
    test("comments should be returned with the most recent comments first", ()=>{
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then((response) => {
            const comments = response.body.comments;
            expect(comments).toBeSorted({ created_at: 'id' })
        })
    })
})

describe("POST /api/articles/:article_id/comments", ()=>{
    test('POST:201 inserts a new comment for an article to the db and returns the posted comment with correct properties and their values (votes default to 0)', () => {
            const newComment = {
            username: 'butter_bridge',
            body: "I cannot imagine any joy comming out of this cold depressing world"
            };
            return request(app)
            .post('/api/articles/1/comments')
            .send(newComment)
            .expect(201)
            .then((response) => {
                const comment = response.body.comment
                expect(comment.article_id).toBe(1)
                expect(comment.author).toBe("butter_bridge")
                expect(comment.body).toBe("I cannot imagine any joy comming out of this cold depressing world")
                expect(comment.votes).toBe(0)
            });
        });
        test('POST:404 sends an appropriate status and error message when given a valid but non-existent id', () => {
            const newComment = {
                username: 'butter_bridge',
                body: "I cannot imagine any joy comming out of this cold depressing world"
                };
                return request(app)
                .post('/api/articles/9999/comments')
                .send(newComment)
                .expect(404)
                .then((response) => {
                expect(response.body.msg).toBe('Not Found');
                });
        });
        test('POST:400 sends an appropriate status and error message when given an invalid id', () => {
            const newComment = {
                username: 'butter_bridge',
                body: "I cannot imagine any joy comming out of this cold depressing world"
                };
                return request(app)
                .post('/api/articles/invalidID/comments')
                .send(newComment)
                .expect(400)
                .then((response) => {expect(response.body.msg).toBe('Bad request');
                });
            });
        test('POST:400 sends an appropriate status and error message for missing keys in post object', () => {
            const newComment = {
                username: 'butter_bridge',
                };
                return request(app)
                .post('/api/articles/1/comments')
                .send(newComment)
                .expect(400)
                .then((response) => {
                expect(response.body.msg).toBe('Bad request');
                });
            });
        test('POST:404 sends an appropriate status and error message for invalid username', () => {
            const newComment = {
                username: 'star_wars',
                body: "I cannot imagine any joy comming out of this cold depressing world"
                };
                return request(app)
                .post('/api/articles/1/comments')
                .send(newComment)
                .expect(404)
                .then((response) => {
                expect(response.body.msg).toBe('Not Found');
                });
            });
})

describe("PATCH /api/articles/:article_id", ()=>{
    test(`PATCH:200 finds an article by it's id and updates it by increasing the current article's vote property by 1`, () => {
        const newVote = { inc_votes : 1 };
        return request(app)
        .patch('/api/articles/1')
        .send(newVote)
        .expect(200)
        .then((response) => {
            const article = response.body;
            expect(article.article_id).toBe(1)
            expect(article.votes).toBe(101)
            expect(article.title).toBe('Living in the shadow of a great man')
        });
    });
    test(`PATCH:200 finds an article by it's id and updates it by would decreasing the current article's vote property by 100`, () => {
        const newVote = { inc_votes : -100 };
        return request(app)
        .patch('/api/articles/3')
        .send(newVote)
        .expect(200)
        .then((response) => {
            const article = response.body;
            expect(article.article_id).toBe(3)
            expect(article.votes).toBe(-100)
            expect(article.title).toBe('Eight pug gifs that remind me of mitch')
        });
    });
    test('PATCH:404 sends an appropriate status and error message when given a valid but non-existent id', () => {
        const newVote = { inc_votes : 50 };
        return request(app)
        .patch('/api/articles/999999')
        .send(newVote)
        .expect(404)
        .then((response) => {
            const article = response.body;
            expect(article.msg).toBe('No user found for user_id: 999999');
        });
    });
    test('PATCH:400 sends an appropriate status and error message for missing keys in post object', () => {
        const newVote = {  };
        return request(app)
        .patch('/api/articles/idnumbertwo')
        .send(newVote)
        .expect(400)
        .then((response) => {
            const article = response.body;
            expect(article.msg).toBe('Bad request');
        });
    });
})

describe("DELETE /api/comments/:comment_id", ()=>{
    test('DELETE:204 deletes the specified comment and sends no body back', () => {
        return request(app).delete('/api/comments/3').expect(204);
        });
    
    test('DELETE:404 responds with an appropriate status and error message when given a non-existent comment id', () => {
        return request(app)
            .delete('/api/comments/999')
            .expect(404)
            .then((response) => {
            expect(response.body.msg).toBe("No comment found for comment_id: 999");
            });
        });
    test('DELETE:400 responds with an appropriate status and error message when given an invalid id', () => {
        return request(app)
            .delete('/api/comments/CommentID223')
            .expect(400)
            .then((response) => {
            expect(response.body.msg).toBe('Bad request');
            });
        });
})



