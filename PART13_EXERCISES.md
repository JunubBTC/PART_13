# Full Stack Open Part 13 - Chapter 3 Exercises

This document describes the implementation of Chapter 3 exercises (5-17) for the blog backend.

## Exercises Completed ✅

### Exercise 5: Better Structure ✅
**Task:** Structure the application following the chapter example.

**Implementation:**
- Separated models, controllers, utils, and middleware into proper directories
- Created `models/index.js` to handle model associations and synchronization
- Updated `index.js` to use `syncModels()` function
- Added proper async model syncing before server start

**Files Modified:**
- `models/index.js` - Added `syncModels()` function
- `models/blog.js` - Added timestamps and proper configuration
- `index.js` - Updated to use syncModels

---

### Exercise 6: Moar Likes ✅
**Task:** Implement support for changing blog likes.

**Endpoint:** `PUT /api/blogs/:id`

**Request Body:**
```json
{
  "likes": 10
}
```

**Implementation:**
- Created `blogFinder` middleware to find blog by ID
- Implemented PUT route that updates likes field
- Returns updated blog with user information

**File:** `controllers/blogs.js`

---

### Exercise 7: Clean Error Handling ✅
**Task:** Centralize error handling in middleware.

**Implementation:**
- Enhanced `errorHandler` middleware to handle:
  - `SequelizeValidationError` - Returns array of validation messages
  - `SequelizeUniqueConstraintError` - Custom messages for unique violations
  - `SequelizeDatabaseError` - Database-specific errors
- Returns proper HTTP status codes (400, 401, etc.)
- Provides descriptive error messages

**File:** `middleware/errorHandler.js`

---

### Exercise 8: Let There Be Users ✅
**Task:** Add timestamps to users and implement user routes.

**User Fields:**
- `id` - Primary key
- `username` - String, unique, not empty
- `name` - String, not empty
- `email` - String, unique, validated
- `createdAt` - Timestamp (auto)
- `updatedAt` - Timestamp (auto)

**Routes Implemented:**
- `POST /api/users` - Create user (handles password field)
- `GET /api/users` - List all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:username` - Update user by username

**File:** `controllers/users.js`

---

### Exercise 9: Better Errors ✅
**Task:** Validate username as email address with descriptive errors.

**Validation:**
- Username must be valid email format
- Uses regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Email must be unique

**Error Response:**
```json
{
  "error": ["username must be a valid email address"]
}
```

**Files:**
- `controllers/users.js` - Email validation
- `middleware/errorHandler.js` - Better error messages

---

### Exercise 10: Blog Ownership ✅
**Task:** Link blogs to users with token authentication.

**Implementation:**
- Added `userId` foreign key to blogs table
- Blog creation requires valid JWT token
- Token extracted via middleware
- Blog automatically linked to logged-in user

**Changes:**
- `models/blog.js` - Added userId field
- `models/index.js` - Added User-Blog associations
- `controllers/blogs.js` - Added `userExtractor` middleware to POST route

---

### Exercise 11: Control the Destruction ✅
**Task:** Only allow blog creator to delete blogs.

**Implementation:**
- DELETE route checks if `blog.userId === req.user.id`
- Returns 403 Forbidden if user is not the creator
- Requires authentication via token

**File:** `controllers/blogs.js` - DELETE /:id route

---

### Exercise 12: User of Blogs and Blogs of Users ✅
**Task:** Show user info in blogs, and blogs in user info.

**Implementation:**

**GET /api/blogs** - Each blog includes:
```json
{
  "id": 1,
  "author": "Dan Abramov",
  "title": "Overreacted",
  "likes": 10,
  "user": {
    "id": 1,
    "username": "dan@example.com",
    "name": "Dan Abramov"
  }
}
```

**GET /api/users** - Each user includes:
```json
{
  "id": 1,
  "username": "dan@example.com",
  "name": "Dan Abramov",
  "blogs": [
    {
      "id": 1,
      "title": "Overreacted",
      "author": "Dan Abramov",
      "likes": 10
    }
  ]
}
```

**Files:**
- `controllers/blogs.js` - Added User include
- `controllers/users.js` - Added Blog include

---

### Exercise 13: Search ✅
**Task:** Filter blogs by keyword in title (case-insensitive).

**Endpoint:** `GET /api/blogs?search=react`

**Implementation:**
- Uses Sequelize `Op.iLike` operator
- Case-insensitive search
- Searches in title field

**File:** `controllers/blogs.js`

---

### Exercise 14: Better Search ✅
**Task:** Search in both title and author fields.

**Endpoint:** `GET /api/blogs?search=jami`

**Implementation:**
- Uses `Op.or` with array of conditions
- Searches both `title` and `author` fields
- Case-insensitive using `Op.iLike`

**SQL Generated:**
```sql
WHERE (title ILIKE '%keyword%' OR author ILIKE '%keyword%')
```

**File:** `controllers/blogs.js`

---

### Exercise 15: Ordering ✅
**Task:** Return blogs ordered by likes (descending).

**Implementation:**
- Added `order: [['likes', 'DESC']]` to findAll query
- Blogs with most likes appear first

**File:** `controllers/blogs.js`

---

### Exercise 16: Authors ✅
**Task:** Create endpoint showing author statistics.

**Endpoint:** `GET /api/authors`

**Response:**
```json
[
  {
    "author": "Dan Abramov",
    "blogs": "5",
    "likes": "120"
  },
  {
    "author": "Robert Martin",
    "blogs": "3",
    "likes": "45"
  }
]
```

**Implementation:**
- Uses Sequelize aggregate functions:
  - `sequelize.fn('COUNT', ...)` for blog count
  - `sequelize.fn('SUM', ...)` for total likes
- Groups by author
- Orders by total likes (descending)

**SQL Generated:**
```sql
SELECT author, 
       COUNT(id) as blogs, 
       SUM(likes) as likes
FROM blogs
GROUP BY author
ORDER BY likes DESC;
```

**File:** `controllers/authors.js` (new)

---

### Exercise 17: Checkup ✅
**Task:** Add testing endpoints and configure for automated tests.

**Endpoints Added:**

1. **GET /** - Root endpoint
   - Returns HTTP 200 with "OK"

2. **POST /api/reset** - Reset database (testing only)
   - Clears all tables
   - Only available when `TESTING=true`

**Configuration:**

**Environment Variables:**
- `TEST_DATABASE_URL` - Test database connection string
- `TESTING=true` - Enables test mode

**Scripts Added:**
```json
{
  "test": "TESTING=true node --test --test-concurrency=1 tests/api_ch3.test.js",
  "start:test": "TESTING=true node index.js"
}
```

**Database Setup:**
```bash
# Create test database
psql -U postgres -c "CREATE DATABASE test_db;"
```

**Files:**
- `index.js` - Added root and reset endpoints
- `utils/config.js` - Added TEST_DATABASE_URL support
- `.env` - Added TEST_DATABASE_URL
- `package.json` - Added test scripts

---

## Testing the Implementation

### 1. Start the Server
```bash
npm run dev
```

### 2. Create a User
```bash
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{"username":"dan@example.com","name":"Dan Abramov","password":"password123"}'
```

### 3. Login
```bash
curl -X POST http://localhost:3001/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"dan@example.com","password":"password123"}'
```

Copy the token from the response.

### 4. Create a Blog
```bash
curl -X POST http://localhost:3001/api/blogs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"author":"Dan Abramov","url":"https://overreacted.io/","title":"Overreacted","likes":0}'
```

### 5. Search Blogs
```bash
curl "http://localhost:3001/api/blogs?search=react"
```

### 6. Update Likes
```bash
curl -X PUT http://localhost:3001/api/blogs/1 \
  -H "Content-Type: application/json" \
  -d '{"likes":25}'
```

### 7. Get Authors
```bash
curl http://localhost:3001/api/authors
```

### 8. View Blogs with CLI
```bash
node cli.js
```

---

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  avatar VARCHAR(255),
  bio TEXT,
  disabled BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
);
```

### Blogs Table
```sql
CREATE TABLE blogs (
  id SERIAL PRIMARY KEY,
  author TEXT,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  user_id INTEGER REFERENCES users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
);
```

---

## Key Features

### 1. Join Queries
- Users include their blogs
- Blogs include their user
- Efficient SQL JOINs via Sequelize

### 2. Search & Filtering
- Case-insensitive search
- Multiple field search (title, author)
- Optimized WHERE clauses

### 3. Aggregation
- COUNT for blog count
- SUM for total likes
- GROUP BY for author stats

### 4. Authentication
- JWT-based authentication
- Token in Authorization header
- User extraction middleware

### 5. Authorization
- Only blog creator can delete
- Proper error messages (403)

### 6. Error Handling
- Centralized middleware
- Descriptive error messages
- Proper HTTP status codes

### 7. Testing Support
- Test database configuration
- Reset endpoint
- Test mode detection

---

## File Structure

```
PART_13/
├── controllers/
│   ├── authors.js      # Exercise 16
│   ├── blogs.js        # Exercises 5-15
│   ├── comments.js
│   ├── likes.js
│   ├── login.js
│   ├── posts.js
│   ├── shares.js
│   └── users.js        # Exercises 8-9
├── middleware/
│   ├── auth.js
│   └── errorHandler.js # Exercise 7
├── models/
│   ├── blog.js         # Exercise 10
│   ├── comment.js
│   ├── index.js        # Exercise 5
│   ├── like.js
│   ├── post.js
│   ├── share.js
│   └── user.js         # Exercise 8
├── utils/
│   ├── config.js       # Exercise 17
│   ├── db.js
│   ├── init_db.js
│   └── seed.js
├── cli.js              # CLI tool
├── commands.sql        # SQL commands
├── index.js            # Exercise 17
└── package.json        # Exercise 17
```

---

## Next Steps

1. **Run Tests:**
   ```bash
   npm test
   ```

2. **View Blogs:**
   ```bash
   node cli.js
   ```

3. **Explore API:**
   - Use `requests.rest` file in VS Code with REST Client extension
   - Or use curl/Postman

4. **Check GitHub Actions:**
   - Tests should run automatically on push
   - View results in Actions tab

---

## Resources

- [Sequelize Documentation](https://sequelize.org/docs/v6/)
- [Sequelize Operators](https://sequelize.org/docs/v6/core-concepts/model-querying-basics/#operators)
- [Sequelize Aggregations](https://sequelize.org/docs/v6/core-concepts/model-querying-basics/#grouping)
- [Full Stack Open Part 13](https://fullstackopen.com/en/part13)

---

**All Chapter 3 exercises (5-17) are complete! ✅**


---

## Testing Setup Verified ✅

### Files Added:
- `.github/workflows/test.yml` - GitHub Actions workflow for CI/CD
- `tests/api_ch3.test.js` - Comprehensive API tests
- `tests/api_ch4.test.js` - Chapter 4 tests (for future use)
- `tests/helper.js` - Test utilities and database seeding

### Dependencies Added:
```json
{
  "devDependencies": {
    "axios": "^1.7.9",
    "cross-env": "^7.0.3",
    "wait-on": "^8.0.3"
  }
}
```

### Windows Compatibility:
Updated npm scripts to use `cross-env` for cross-platform environment variable support:
```json
{
  "start:test": "cross-env TESTING=true node index.js",
  "test": "cross-env TESTING=true node --test --test-concurrency=1 tests/api_ch3.test.js"
}
```

### Running Tests Locally:
```bash
# Terminal 1: Start test server
npm run start:test

# Terminal 2: Run tests
npm test
```

### GitHub Actions:
Tests run automatically on every push to main branch. Check results at:
https://github.com/JunubBTC/PART_13/actions

---

**All Chapter 3 exercises (5-17) complete with automated testing! ✅🎉**
