# Full Stack Open Part 13 - Social Media Blog Backend

A full-featured social media blog application backend built with Node.js, Express, and PostgreSQL using Sequelize ORM. This project implements all exercises from Full Stack Open Part 13, Chapters 1-3.

## 🎯 Project Status

- ✅ **Chapter 1-2**: Basic setup and Sequelize ORM
- ✅ **Chapter 3 (Exercises 5-17)**: Join tables, queries, search, aggregation, and testing

## Features

### 🔐 Authentication & Users
- User registration with email validation
- JWT-based authentication
- Password hashing with bcrypt
- User profiles with avatars and bios
- Timestamps (createdAt, updatedAt)

### 📝 Blog System (Part 13 Exercises)
- Create, read, update, delete blogs
- Blog ownership and authorization
- Search blogs by title or author (case-insensitive)
- Order blogs by likes (most popular first)
- Blog-user relationships with JOIN queries

### 📊 Statistics & Aggregation
- Author statistics endpoint
- Blog count per author
- Total likes per author
- Sorted by popularity

### 💬 Social Features (Posts System)
- Create posts with text & optional images
- Like/unlike functionality
- Comment system (add, edit, delete)
- Share posts with captions
- Real-time engagement metrics

### 🔍 Advanced Queries
- Search filtering with Sequelize operators
- JOIN queries for related data
- Aggregate functions (COUNT, SUM)
- GROUP BY and ORDER BY support
- Optimized WHERE clauses

### 🧪 Testing Support
- Separate test database configuration
- Reset endpoint for test cleanup
- Environment-based configuration
- Test scripts ready for CI/CD

## Tech Stack

- **Node.js** - Runtime environment
- **Express** - Web framework
- **PostgreSQL** - Relational database
- **Sequelize** - ORM (Object-Relational Mapping)
- **JWT** - Authentication
- **bcrypt** - Password hashing

## Prerequisites

- Node.js (v18 or higher)
- Docker Desktop (for running PostgreSQL)
- Git

## Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd PART_13
npm install
```

### 2. Set up PostgreSQL

Use an Aiven PostgreSQL service, Docker, or a local PostgreSQL installation.
For Aiven, copy the connection details from the service console. For Docker:

```bash
docker run -d -e POSTGRES_PASSWORD=1234 -p 5432:5432 --name part13-postgres postgres
```

### 3. Configure Environment

Set `DATABASE_URL` in the ignored `.env` file. Do not commit this file or share
its credentials. For Aiven, omit the `?sslmode=require` parameter; the application
configures SSL for Sequelize.

```
DATABASE_URL=postgres://postgres:1234@localhost:5432/postgres
PORT=3001
SECRET=your-secret-key-change-this-in-production
```

### Run the database exercises

Create and populate the `blogs` table by running the SQL in `commands.sql` in
your PostgreSQL console. Then print the blogs with:

```bash
node cli.js
```

### 4. Initialize Database

```bash
npm run db:init
```

This creates all the necessary tables.

### 5. Seed Database (Optional)

```bash
npm run db:seed
```

This adds sample users and posts for testing.

### 6. Start the Server

```bash
npm run dev
```

Server will start on `http://localhost:3001`

## Database Schema

### Users Table
- `id` - Primary key
- `username` - Unique username
- `name` - Full name
- `email` - Unique email
- `password_hash` - Hashed password
- `avatar` - Profile picture URL
- `bio` - User biography
- `disabled` - Account status
- `created_at`, `updated_at` - Timestamps

### Posts Table
- `id` - Primary key
- `content` - Post text content
- `image_url` - Optional image URL
- `user_id` - Foreign key to users
- `created_at`, `updated_at` - Timestamps

### Likes Table
- `id` - Primary key
- `user_id` - Foreign key to users
- `post_id` - Foreign key to posts
- Unique constraint on (user_id, post_id)

### Comments Table
- `id` - Primary key
- `content` - Comment text
- `user_id` - Foreign key to users
- `post_id` - Foreign key to posts
- `created_at`, `updated_at` - Timestamps

### Shares Table
- `id` - Primary key
- `user_id` - Foreign key to users
- `post_id` - Foreign key to posts
- `caption` - Optional share caption
- `created_at`, `updated_at` - Timestamps

### Blogs Table
- `id` - Auto-incrementing primary key
- `author` - Optional author
- `url`, `title` - Required text fields
- `likes` - Integer defaulting to 0

## API Endpoints

### Blogs

- `GET /api/blogs` - List all blogs
- `POST /api/blogs` - Create a blog (`author`, `url`, `title`, optional `likes`)
- `DELETE /api/blogs/:id` - Delete a blog

Start the API with `npm start`.

### Authentication

#### Register
```
POST /api/users
Content-Type: application/json

{
  "username": "johndoe",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login
```
POST /api/login
Content-Type: application/json

{
  "username": "johndoe",
  "password": "password123"
}

Response:
{
  "token": "eyJhbGc...",
  "username": "johndoe",
  "name": "John Doe",
  "id": 1,
  "avatar": "...",
  "bio": "..."
}
```

### Users

```
GET /api/users              - Get all users
GET /api/users/:id          - Get single user
PUT /api/users/:id          - Update user (name, bio, avatar)
```

### Posts

```
GET /api/posts              - Get all posts (feed) with counts
GET /api/posts/:id          - Get single post with full details
POST /api/posts             - Create post (requires auth)
PUT /api/posts/:id          - Update post (requires auth, own post)
DELETE /api/posts/:id       - Delete post (requires auth, own post)
```

**Create Post:**
```
POST /api/posts
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "My awesome post!",
  "imageUrl": "https://example.com/image.jpg"  // optional
}
```

### Likes

```
POST /api/likes             - Like a post (requires auth)
DELETE /api/likes/:postId   - Unlike a post (requires auth)
GET /api/likes/post/:postId - Get all likes for a post
```

**Like a Post:**
```
POST /api/likes
Authorization: Bearer <token>
Content-Type: application/json

{
  "postId": 1
}
```

### Comments

```
GET /api/comments/post/:postId  - Get comments for a post
POST /api/comments              - Create comment (requires auth)
PUT /api/comments/:id           - Update comment (requires auth, own comment)
DELETE /api/comments/:id        - Delete comment (requires auth, own comment)
```

**Create Comment:**
```
POST /api/comments
Authorization: Bearer <token>
Content-Type: application/json

{
  "postId": 1,
  "content": "Great post!"
}
```

### Shares

```
POST /api/shares                - Share a post (requires auth)
GET /api/shares/post/:postId    - Get shares for a post
DELETE /api/shares/:id          - Delete share (requires auth, own share)
```

**Share a Post:**
```
POST /api/shares
Authorization: Bearer <token>
Content-Type: application/json

{
  "postId": 1,
  "caption": "Check this out!"  // optional
}
```

## Testing with Sample Data

After running `npm run db:seed`, you can test with these credentials:

- **Username:** `john_doe` | **Password:** `password123`
- **Username:** `jane_smith` | **Password:** `password123`
- **Username:** `bob_wilson` | **Password:** `password123`

## Project Structure

```
PART_13/
├── controllers/          # Route handlers
│   ├── comments.js
│   ├── likes.js
│   ├── login.js
│   ├── posts.js
│   ├── shares.js
│   └── users.js
├── middleware/          # Custom middleware
│   ├── auth.js         # Authentication
│   └── errorHandler.js
├── models/             # Sequelize models
│   ├── comment.js
│   ├── index.js        # Model associations
│   ├── like.js
│   ├── post.js
│   ├── share.js
│   └── user.js
├── utils/              # Utility functions
│   ├── config.js       # Environment config
│   ├── db.js          # Database connection
│   ├── init_db.js     # Database initialization
│   └── seed.js        # Sample data seeder
├── .env               # Environment variables
├── .gitignore
├── index.js           # Application entry point
├── package.json
└── README.md
```

## Development

```bash
# Start development server with auto-reload
npm run dev

# Test database connection
npm run test:connection

# Initialize database tables
npm run db:init

# Seed database with sample data
npm run db:seed
```

## Docker Commands

```bash
# Start PostgreSQL
docker run -d -e POSTGRES_PASSWORD=1234 -p 5432:5432 --name part13-postgres postgres

# Stop PostgreSQL
docker stop part13-postgres

# Start existing container
docker start part13-postgres

# Access PostgreSQL console
docker exec -it part13-postgres psql -U postgres postgres

# View logs
docker logs part13-postgres

# Remove container
docker rm -f part13-postgres
```

## Environment Variables

```env
DATABASE_URL=postgres://postgres:1234@localhost:5432/postgres
PORT=3001
SECRET=your-secret-key-here
```

## Security Notes

- Passwords are hashed using bcrypt (10 salt rounds)
- JWT tokens expire after 7 days
- All authenticated routes require valid JWT token
- Users can only modify their own content
- Disabled accounts cannot log in

## Example API Usage

### 1. Register a new user
```bash
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{"username":"newuser","name":"New User","email":"new@example.com","password":"password123"}'
```

### 2. Login
```bash
curl -X POST http://localhost:3001/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"newuser","password":"password123"}'
```

### 3. Create a post (use token from login)
```bash
curl -X POST http://localhost:3001/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"content":"My first post!"}'
```

### 4. Get all posts
```bash
curl http://localhost:3001/api/posts
```

### 5. Like a post
```bash
curl -X POST http://localhost:3001/api/likes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"postId":1}'
```

## Troubleshooting

### Database connection failed
- Make sure Docker Desktop is running
- Check if PostgreSQL container is running: `docker ps`
- Verify DATABASE_URL in .env file

### Port already in use
- Change PORT in .env file
- Or stop the process using port 3001

### Token invalid
- Token might be expired (7 days)
- Login again to get a new token

## License

MIT

## Author

Created by Wuor Bhang for Full Stack Open Part 13 Exercise
