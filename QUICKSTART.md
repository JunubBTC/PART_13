# Quick Start Guide 🚀

## Setup in 5 Steps

### 1️⃣ Start PostgreSQL Container

```bash
docker run -d -e POSTGRES_PASSWORD=1234 -p 5432:5432 --name part13-postgres postgres
```

Wait ~5 seconds for PostgreSQL to start.

### 2️⃣ Initialize Database Tables

```bash
npm run db:init
```

This creates all necessary tables (users, posts, likes, comments, shares).

### 3️⃣ Seed Sample Data

```bash
npm run db:seed
```

This adds:
- 3 test users
- 5 posts with images
- 8 likes
- 5 comments
- 2 shares

### 4️⃣ Start the Server

```bash
npm run dev
```

Server starts at `http://localhost:3001`

### 5️⃣ Test the API

#### Login with test user:

```bash
curl -X POST http://localhost:3001/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"john_doe","password":"password123"}'
```

Copy the `token` from the response.

#### Get all posts (Feed):

```bash
curl http://localhost:3001/api/posts
```

#### Create a post (replace YOUR_TOKEN):

```bash
curl -X POST http://localhost:3001/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"content":"Hello from the API!"}'
```

## Test Users

All test users have the same password: `password123`

| Username | Name | Email |
|----------|------|-------|
| `john_doe` | John Doe | john@example.com |
| `jane_smith` | Jane Smith | jane@example.com |
| `bob_wilson` | Bob Wilson | bob@example.com |

## Quick API Reference

### Authentication
- `POST /api/users` - Register
- `POST /api/login` - Login (returns token)

### Posts
- `GET /api/posts` - Get all posts (feed)
- `POST /api/posts` - Create post (requires token)
- `PUT /api/posts/:id` - Update post (requires token)
- `DELETE /api/posts/:id` - Delete post (requires token)

### Interactions
- `POST /api/likes` - Like a post
- `DELETE /api/likes/:postId` - Unlike
- `POST /api/comments` - Comment on post
- `POST /api/shares` - Share a post

## Testing with VS Code REST Client

1. Install "REST Client" extension in VS Code
2. Open `requests.rest` file
3. Click "Send Request" above any endpoint

## Troubleshooting

**Database connection failed?**
```bash
# Check if PostgreSQL is running
docker ps

# If not running, start it
docker start part13-postgres
```

**Port already in use?**
- Change `PORT` in `.env` file

**Need to reset database?**
```bash
# Stop and remove container
docker rm -f part13-postgres

# Start fresh
docker run -d -e POSTGRES_PASSWORD=1234 -p 5432:5432 --name part13-postgres postgres

# Re-initialize
npm run db:init
npm run db:seed
```

## Next Steps

See `README.md` for:
- Complete API documentation
- Database schema details
- Advanced usage examples
- Security notes

Happy coding! 🎉
