\c nc_news_test
select * FROM articles
LEFT JOIN comments ON comments.article_id = articles.article_id;