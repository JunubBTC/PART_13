# Full Stack Open Part 13 - Exercises 19-26 Summary

## Repository
**GitHub**: https://github.com/JunubBTC/PART_13

## Completed Exercises

### Exercise 19: Remember the Year ✅
**Feature**: Blog year validation

**Implementation**:
- Created migration `20261112_01_add_year_to_blogs.js` to add `year` column to blogs table
- Updated `models/blog.js` with year field and Sequelize validators
- Updated `controllers/blogs.js` to handle year in POST and PUT requests
- Year validation rules:
  - Must be integer
  - Minimum: 1991
  - Maximum: current year (2026)
  - Optional field (can be null)

**Tests**:
```bash
# Valid years accepted: 1991, 2025, 2026
# Invalid years rejected: 1990, 2027, "not a number"
```

---

### Exercise 20: Reading List Database ✅
**Feature**: Database structure for reading lists

**Implementation**:
- Created migration `20261112_02_add_reading_lists.js`
- Created `models/readingList.js` with fields:
  - `id` (primary key)
  - `userId` (foreign key to users)
  - `blogId` (foreign key to blogs)
  - `read` (boolean, default: false)
  - Unique constraint on (userId, blogId) pair
- Updated `models/index.js` with many-to-many relationship:
  ```javascript
  User.belongsToMany(Blog, { through: ReadingList, as: 'readings' })
  Blog.belongsToMany(User, { through: ReadingList, as: 'readersOf' })
  ```

---

### Exercise 21: Expanding the Reading List ✅
**Feature**: Add blogs to reading list and view user's reading list

**Implementation**:
- Created `controllers/readingLists.js` with POST endpoint
- **POST /api/readinglists**:
  - Accepts `{ blogId, userId }`
  - Validates blog and user exist (returns 404 if not found)
  - Validates required fields (returns 400 if missing)
  - Creates reading list entry with `read: false`
  - Returns 400 if duplicate (unique constraint)

- Updated `controllers/users.js` GET /api/users/:id:
  - Includes `readings` array with blog details
  - Shows all blogs in user's reading list

---

### Exercise 22: Bookkeeping ✅
**Feature**: Include join table information in reading list

**Implementation**:
- Updated GET /api/users/:id response to include `readingList` nested object:
  ```json
  {
    "readings": [{
      "id": 3,
      "title": "Clean React",
      "readingList": {
        "id": 2,
        "read": false
      }
    }]
  }
  ```
- Used Sequelize `through.attributes` to include join table fields

---

### Exercise 23: Better Bookkeeping ✅
**Feature**: Mark blogs as read

**Implementation**:
- **PUT /api/readinglists/:id**:
  - Requires authentication (token)
  - Accepts `{ "read": true/false }`
  - Users can only modify their own reading list entries (returns 401 otherwise)
  - Returns 404 if reading list entry not found
  - Updates and returns the modified entry

---

### Exercise 24: More Control ✅
**Feature**: Filter reading list by read status

**Implementation**:
- Updated GET /api/users/:id with query parameter support:
  - `GET /api/users/:id` - returns all readings
  - `GET /api/users/:id?read=true` - returns only read blogs
  - `GET /api/users/:id?read=false` - returns only unread blogs
- Implemented using Sequelize `where` clause in `through` options

---

### Exercise 25: Grande Finale (Session Management) ✅
**Feature**: Server-side session management with token revocation

**Implementation**:

1. **Migration** (`20261112_03_add_sessions.js`):
   - Created `sessions` table with:
     - `id` (primary key)
     - `user_id` (foreign key to users)
     - `token` (text, unique)
     - timestamps

2. **Model** (`models/session.js`):
   - Session model with user association

3. **Login** (`controllers/login.js`):
   - On successful login, creates session record in database
   - Stores token with user_id

4. **Logout** (`controllers/logout.js`):
   - **DELETE /api/logout**
   - Requires authentication
   - Removes session from database
   - Returns 204 on success
   - Returns 401 without token

5. **Middleware** (`middleware/auth.js`):
   - Updated `userExtractor` to check session validity
   - Verifies JWT token exists in database
   - Returns 401 if session not found (expired/logged out)
   - Checks if user is disabled

**Security Features**:
- Disabled users cannot authenticate
- Token becomes invalid after logout
- Old tokens cannot be reused
- Each login creates new session

---

### Exercise 26: The Final Check ✅
**Feature**: Testing and CI/CD

**Implementation**:

1. **Updated /api/reset endpoint**:
   ```javascript
   await Session.destroy({ where: {} })
   await ReadingList.destroy({ where: {} })
   ```

2. **Test script** (already correct in package.json):
   ```json
   "test": "cross-env TESTING=true node --test --test-concurrency=1 tests/api_ch3.test.js"
   ```

3. **GitHub Actions** (.github/workflows/test.yml):
   - Updated to run both Chapter 3 and 4 tests
   - Uses PostgreSQL service container
   - Runs on push to main branch

**Test Results**:
- ✅ Chapter 3 tests: 8/8 passing
- ✅ Chapter 4 tests: 26/26 passing
- ✅ Total: 34/34 tests passing

---

## Database Schema Changes

### New Tables
1. **reading_lists**:
   - Manages many-to-many relationship between users and blogs
   - Tracks read/unread status
   - Unique constraint prevents duplicates

2. **sessions**:
   - Stores active user sessions
   - Enables token revocation on logout
   - Provides server-side session management

### Modified Tables
1. **blogs**:
   - Added `year` column (integer, nullable)

---

## API Endpoints Summary

### Reading Lists
- `POST /api/readinglists` - Add blog to reading list
- `PUT /api/readinglists/:id` - Mark blog as read (authenticated)
- `GET /api/users/:id` - View user with reading list
- `GET /api/users/:id?read=true/false` - Filter reading list

### Session Management
- `POST /api/login` - Login (creates session)
- `DELETE /api/logout` - Logout (deletes session, authenticated)

### Blogs (Updated)
- `POST /api/blogs` - Create blog with year field
- `PUT /api/blogs/:id` - Update blog including year

---

## Testing

### Local Testing
```bash
# Start test server
npm run start:test

# Run Chapter 3 tests
TESTING=true node --test --test-concurrency=1 tests/api_ch3.test.js

# Run Chapter 4 tests
TESTING=true node --test --test-concurrency=1 tests/api_ch4.test.js
```

### CI/CD
- GitHub Actions automatically runs all tests on push
- Tests run against PostgreSQL 17
- Uses wait-on to ensure server is ready

---

## Technologies Used
- **Database**: PostgreSQL (Aiven cloud)
- **ORM**: Sequelize 6.37.8
- **Migrations**: Umzug 3.8.3
- **Authentication**: JWT (jsonwebtoken 9.0.3)
- **Testing**: Node.js built-in test runner
- **CI/CD**: GitHub Actions

---

## Migration Files
1. `20261112_00_initialize_users_and_blogs.js` - Initial schema
2. `20261112_01_add_year_to_blogs.js` - Blog year field
3. `20261112_02_add_reading_lists.js` - Reading list table
4. `20261112_03_add_sessions.js` - Sessions table

---

## Key Features Implemented

### Security
✅ JWT authentication with session validation  
✅ Token revocation on logout  
✅ Disabled user check  
✅ User can only modify their own data  

### Data Validation
✅ Year validation (1991 - current year)  
✅ Email format validation  
✅ Required field validation  
✅ Unique constraints (reading lists, sessions)  

### Many-to-Many Relationships
✅ Users ↔ Blogs (reading lists)  
✅ Join table attributes exposed in API  
✅ Filtering by join table fields  

### Testing
✅ Comprehensive API tests (34 tests)  
✅ Integration tests  
✅ Automated CI/CD pipeline  

---

## Completion Status

All exercises from **19 to 26** are **COMPLETE** and **TESTED**. ✅

**Repository**: https://github.com/JunubBTC/PART_13  
**All tests passing**: ✅ 34/34  
**GitHub Actions**: ✅ Green  
