# Full Stack Open Part 13 - Social Media Blog Backend

A full-featured social media blog application backend built with Node.js, Express, and PostgreSQL using Sequelize ORM. This project implements all exercises from Full Stack Open Part 13, Chapters 1-3.

## 🎯 Project Status

- ✅ **Chapter 1-2**: Basic setup and Sequelize ORM
- ✅ **Chapter 3 (Exercises 5-17)**: Join tables, queries, search, aggregation, and testing
- ✅ **Chapter 4 (Exercises 18-26)**: Migrations, many-to-many relationships, reading lists, and session management

**All 26 exercises completed!** 🎉

See [EXERCISES_19_26_SUMMARY.md](./EXERCISES_19_26_SUMMARY.md) for detailed documentation of exercises 19-26.

## Features

### 🔐 Authentication & Users
- User registration with email validation
- JWT-based authentication with server-side sessions
- Session management with token revocation
- Logout functionality (invalidates tokens)
- Password hashing with bcrypt
- User profiles with avatars and bios
- Disabled user support
- Timestamps (createdAt, updatedAt)

### 📝 Blog System (Part 13 Exercises)
- Create, read, update, delete blogs
- Blog year validation (1991 - current year)
- Blog ownership and authorization
- Search blogs by title or author (case-insensitive)
- Order blogs by likes (most popular first)
- Blog-user relationships with JOIN queries

### 📚 Reading Lists (Chapter 4)
- Users can add blogs to personal reading lists
- Mark blogs as read/unread
- Filter reading list by read status
- Many-to-many relationship between users and blogs
- Unique constraint prevents duplicate entries

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
- GitHub Actions CI/CD pipeline
- 34 automated tests (all passing)
- Test scripts for both Chapter 3 and Chapter 4

## Tech Stack

- **Node.js** - Runtime environment
- **Express** - Web framework
- **PostgreSQL** - Relational database (Aiven cloud)
- **Sequelize** - ORM (Object-Relational Mapping)
- **Umzug** - Database migrations
- **JWT** - Authentication
- **bcrypt** - Password hashing

## Prerequisites

- Node.js (v18 or higher)
- Docker Desktop (for running PostgreSQL)
- Git

## Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/JunubBTC/PART_13
cd PART_13
npm install
```

### 2. Set up PostgreSQL

Use an Aiven PostgreSQL service, Docker, or a local PostgreSQL installation.
For Aiven, copy the connection details from the service console. For Docker:

```bash
docker run -d -e POSTGRES_PASSWORD=Your_PASSWORD -p 5432:5432 --name part13-postgres postgres
```

### 3. Configure Environment

Set `DATABASE_URL` in the ignored `.env` file. Do not commit this file or share
its credentials. For Aiven, omit the `?sslmode=require` parameter; the application
configures SSL for Sequelize.

```
DATABASE_URL=postgres://postgres:YOUR_PASSWORD@localhost:5432/postgres
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
- `year` - Optional integer (1991 - current year)
- `user_id` - Foreign key to users
- `created_at`, `updated_at` - Timestamps

### Reading Lists Table (Chapter 4)
- `id` - Primary key
- `user_id` - Foreign key to users
- `blog_id` - Foreign key to blogs
- `read` - Boolean (default: false)
- Unique constraint on (user_id, blog_id)
- `created_at`, `updated_at` - Timestamps

### Sessions Table (Chapter 4)
- `id` - Primary key
- `user_id` - Foreign key to users
- `token` - JWT token (unique)
- `created_at`, `updated_at` - Timestamps

## API Endpoints

### Blogs

- `GET /api/blogs` - List all blogs (with search & ordering)
- `GET /api/blogs/:id` - Get single blog
- `POST /api/blogs` - Create a blog (requires auth)
- `PUT /api/blogs/:id` - Update a blog (likes, year, etc.)
- `DELETE /api/blogs/:id` - Delete a blog (requires auth, own blog)

**Search & Filter:**
```
GET /api/blogs?search=react     - Search in title or author
```

**Create Blog with Year:**
```
POST /api/blogs
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My Blog Post",
  "author": "John Doe",
  "url": "https://example.com/post",
  "year": 2026
}
```

### Reading Lists (Chapter 4)

```
POST /api/readinglists          - Add blog to reading list
PUT /api/readinglists/:id       - Mark blog as read (requires auth)
```

**Add to Reading List:**
```
POST /api/readinglists
Content-Type: application/json

{
  "blogId": 1,
  "userId": 2
}
```

**Mark as Read:**
```
PUT /api/readinglists/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "read": true
}
```

**Get User with Reading List:**
```
GET /api/users/1                    - All readings
GET /api/users/1?read=true          - Only read blogs
GET /api/users/1?read=false         - Only unread blogs
```

### Session Management (Chapter 4)

```
POST /api/login                 - Login (creates session)
DELETE /api/logout              - Logout (invalidates token, requires auth)
```

**Logout:**
```
DELETE /api/logout
Authorization: Bearer <token>
```

### Authors & Statistics

```
GET /api/authors                - Get author statistics (blog count, total likes)
```

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
├── .github/
│   └── workflows/
│       └── test.yml        # GitHub Actions CI/CD
├── controllers/            # Route handlers
│   ├── authors.js         # Author statistics
│   ├── blogs.js           # Blog CRUD
│   ├── comments.js
│   ├── likes.js
│   ├── login.js
│   ├── logout.js          # Session management
│   ├── posts.js
│   ├── readingLists.js    # Reading list API
│   ├── shares.js
│   └── users.js
├── middleware/             # Custom middleware
│   ├── auth.js            # Authentication & sessions
│   └── errorHandler.js
├── migrations/             # Database migrations
│   ├── 20261112_00_initialize_users_and_blogs.js
│   ├── 20261112_01_add_year_to_blogs.js
│   ├── 20261112_02_add_reading_lists.js
│   └── 20261112_03_add_sessions.js
├── models/                 # Sequelize models
│   ├── blog.js
│   ├── comment.js
│   ├── index.js           # Model associations
│   ├── like.js
│   ├── post.js
│   ├── readingList.js     # Reading list model
│   ├── session.js         # Session model
│   ├── share.js
│   └── user.js
├── tests/                  # API tests
│   ├── api_ch3.test.js    # Chapter 3 tests
│   ├── api_ch4.test.js    # Chapter 4 tests
│   └── helper.js          # Test helpers
├── utils/                  # Utility functions
│   ├── config.js          # Environment config
│   ├── db.js             # Database connection & Umzug
│   ├── drop_all_tables.js # Development utility
│   ├── rollback.js        # Migration rollback
│   └── seed.js           # Sample data seeder
├── .env                   # Environment variables (gitignored)
├── .gitignore
├── EXERCISES_19_26_SUMMARY.md  # Detailed documentation
├── index.js               # Application entry point
├── package.json
└── README.md
```

## Development

```bash
# Start development server with auto-reload
npm run dev

# Start production server
npm start

# Start test server (with /api/reset endpoint)
npm run start:test

# Test database connection
npm run test:connection

# Run migrations down (rollback last migration)
npm run migration:down

# Seed database with sample data
npm run db:seed
```

## Testing

```bash
# Run Chapter 3 tests (8 tests)
TESTING=true node --test --test-concurrency=1 tests/api_ch3.test.js

# Run Chapter 4 tests (26 tests)
TESTING=true node --test --test-concurrency=1 tests/api_ch4.test.js

# Run all tests via npm
npm test
```

**Test Requirements:**
- Server must be running in test mode (`npm run start:test`)
- Uses TEST_DATABASE_URL from .env
- Runs on http://localhost:3001

## Migrations

This project uses [Umzug](https://github.com/sequelize/umzug) for database migrations.

```bash
# Migrations run automatically on npm start

# To rollback last migration:
npm run migration:down
```

**Migration Files:**
- `20261112_00_initialize_users_and_blogs.js` - Initial schema
- `20261112_01_add_year_to_blogs.js` - Add year field to blogs
- `20261112_02_add_reading_lists.js` - Reading lists table
- `20261112_03_add_sessions.js` - Sessions table

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
- Server-side session management prevents token reuse after logout
- All authenticated routes require valid JWT token AND active session
- Users can only modify their own content
- Disabled accounts cannot log in or perform actions
- Tokens are invalidated on logout

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
