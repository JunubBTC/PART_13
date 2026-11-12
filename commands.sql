-- Commands for PostgreSQL database management

-- Create test database (run this outside of any database)
CREATE DATABASE test_db;

-- List all databases
\l

-- Connect to a database
\c defaultdb
\c test_db

-- List all tables
\d

-- View users table
\d users

-- View blogs table  
\d blogs

-- Query all users
SELECT * FROM users;

-- Query all blogs with user info
SELECT b.id, b.author, b.title, b.likes, u.username, u.name as added_by
FROM blogs b
LEFT JOIN users u ON b.user_id = u.id;

-- Query authors with blog count and likes (Exercise 16)
SELECT author, COUNT(id) as blogs, SUM(likes) as likes
FROM blogs
GROUP BY author
ORDER BY likes DESC;

-- Search blogs by title or author (case insensitive)
SELECT * FROM blogs
WHERE LOWER(title) LIKE '%react%' OR LOWER(author) LIKE '%react%';

-- Delete all data from tables
DELETE FROM shares;
DELETE FROM comments;
DELETE FROM likes;
DELETE FROM posts;
DELETE FROM blogs;
DELETE FROM users;

-- Drop tables
DROP TABLE IF EXISTS shares CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS likes CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS blogs CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Reset sequences
ALTER SEQUENCE users_id_seq RESTART WITH 1;
ALTER SEQUENCE blogs_id_seq RESTART WITH 1;
ALTER SEQUENCE posts_id_seq RESTART WITH 1;
ALTER SEQUENCE likes_id_seq RESTART WITH 1;
ALTER SEQUENCE comments_id_seq RESTART WITH 1;
ALTER SEQUENCE shares_id_seq RESTART WITH 1;

-- Exit psql
\q
