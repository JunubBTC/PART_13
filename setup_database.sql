-- Create the blogs table for the blog application
CREATE TABLE IF NOT EXISTS blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes integer DEFAULT 0
);

-- Insert some sample data
INSERT INTO blogs (author, url, title, likes) VALUES 
    ('Dan Abramov', 'https://overreacted.io/', 'Overreacted', 10),
    ('Martin Fowler', 'https://martinfowler.com/', 'Martin Fowler Blog', 15);

-- Display all blogs
SELECT * FROM blogs;
