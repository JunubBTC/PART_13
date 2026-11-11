# API Documentation

Base URL: `http://localhost:3001/api`

## Table of Contents
1. [Authentication](#authentication)
2. [Users](#users)
3. [Posts](#posts)
4. [Likes](#likes)
5. [Comments](#comments)
6. [Shares](#shares)
7. [Response Format](#response-format)
8. [Error Codes](#error-codes)

---

## Authentication

### Register New User
```http
POST /api/users
Content-Type: application/json

{
  "username": "johndoe",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response** (201 Created):
```json
{
  "id": 1,
  "username": "johndoe",
  "name": "John Doe",
  "email": "john@example.com",
  "avatar": "https://via.placeholder.com/150",
  "bio": "",
  "disabled": false,
  "createdAt": "2026-11-11T10:00:00.000Z",
  "updatedAt": "2026-11-11T10:00:00.000Z"
}
```

### Login
```http
POST /api/login
Content-Type: application/json

{
  "username": "johndoe",
  "password": "password123"
}
```

**Response** (200 OK):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "johndoe",
  "name": "John Doe",
  "id": 1,
  "avatar": "https://via.placeholder.com/150",
  "bio": ""
}
```

---

## Users

### Get All Users
```http
GET /api/users
```

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "username": "johndoe",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "https://via.placeholder.com/150",
    "bio": "Full-stack developer",
    "disabled": false,
    "createdAt": "2026-11-11T10:00:00.000Z",
    "updatedAt": "2026-11-11T10:00:00.000Z",
    "posts": [...]
  }
]
```

### Get Single User
```http
GET /api/users/:id
```

**Response** (200 OK):
```json
{
  "id": 1,
  "username": "johndoe",
  "name": "John Doe",
  "email": "john@example.com",
  "avatar": "https://via.placeholder.com/150",
  "bio": "Full-stack developer",
  "disabled": false,
  "posts": [
    {
      "id": 1,
      "content": "My first post!",
      "imageUrl": null,
      "createdAt": "2026-11-11T10:05:00.000Z"
    }
  ]
}
```

### Update User
```http
PUT /api/users/:id
Content-Type: application/json

{
  "name": "John Updated Doe",
  "bio": "Updated bio text",
  "avatar": "https://new-avatar-url.com/image.jpg"
}
```

---

## Posts

### Get All Posts (Feed)
```http
GET /api/posts
```

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "content": "Check out this amazing sunset!",
    "imageUrl": "https://example.com/sunset.jpg",
    "userId": 1,
    "createdAt": "2026-11-11T10:05:00.000Z",
    "updatedAt": "2026-11-11T10:05:00.000Z",
    "likesCount": "5",
    "commentsCount": "3",
    "sharesCount": "2",
    "user": {
      "id": 1,
      "username": "johndoe",
      "name": "John Doe",
      "avatar": "https://via.placeholder.com/150"
    }
  }
]
```

### Get Single Post
```http
GET /api/posts/:id
```

**Response** (200 OK):
```json
{
  "id": 1,
  "content": "Check out this amazing sunset!",
  "imageUrl": "https://example.com/sunset.jpg",
  "userId": 1,
  "createdAt": "2026-11-11T10:05:00.000Z",
  "updatedAt": "2026-11-11T10:05:00.000Z",
  "likesCount": "5",
  "commentsCount": "3",
  "sharesCount": "2",
  "user": {
    "id": 1,
    "username": "johndoe",
    "name": "John Doe",
    "avatar": "https://via.placeholder.com/150"
  },
  "likes": [
    {
      "id": 1,
      "userId": 2,
      "postId": 1,
      "user": {
        "id": 2,
        "username": "janedoe",
        "name": "Jane Doe"
      }
    }
  ],
  "comments": [
    {
      "id": 1,
      "content": "Beautiful photo!",
      "userId": 2,
      "postId": 1,
      "createdAt": "2026-11-11T10:10:00.000Z",
      "user": {
        "id": 2,
        "username": "janedoe",
        "name": "Jane Doe",
        "avatar": "https://via.placeholder.com/150"
      }
    }
  ]
}
```

### Create Post
```http
POST /api/posts
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "This is my new post!",
  "imageUrl": "https://example.com/image.jpg"  // optional
}
```

**Response** (201 Created):
```json
{
  "id": 2,
  "content": "This is my new post!",
  "imageUrl": "https://example.com/image.jpg",
  "userId": 1,
  "createdAt": "2026-11-11T10:15:00.000Z",
  "updatedAt": "2026-11-11T10:15:00.000Z",
  "user": {
    "id": 1,
    "username": "johndoe",
    "name": "John Doe",
    "avatar": "https://via.placeholder.com/150"
  }
}
```

### Update Post
```http
PUT /api/posts/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Updated post content",
  "imageUrl": "https://example.com/new-image.jpg"
}
```

### Delete Post
```http
DELETE /api/posts/:id
Authorization: Bearer <token>
```

**Response**: 204 No Content

---

## Likes

### Like a Post
```http
POST /api/likes
Authorization: Bearer <token>
Content-Type: application/json

{
  "postId": 1
}
```

**Response** (201 Created):
```json
{
  "id": 1,
  "userId": 1,
  "postId": 1,
  "createdAt": "2026-11-11T10:20:00.000Z",
  "user": {
    "id": 1,
    "username": "johndoe",
    "name": "John Doe"
  }
}
```

### Unlike a Post
```http
DELETE /api/likes/:postId
Authorization: Bearer <token>
```

**Response**: 204 No Content

### Get Likes for a Post
```http
GET /api/likes/post/:postId
```

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "userId": 1,
    "postId": 1,
    "createdAt": "2026-11-11T10:20:00.000Z",
    "user": {
      "id": 1,
      "username": "johndoe",
      "name": "John Doe",
      "avatar": "https://via.placeholder.com/150"
    }
  }
]
```

---

## Comments

### Get Comments for a Post
```http
GET /api/comments/post/:postId
```

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "content": "Great post!",
    "userId": 2,
    "postId": 1,
    "createdAt": "2026-11-11T10:25:00.000Z",
    "updatedAt": "2026-11-11T10:25:00.000Z",
    "user": {
      "id": 2,
      "username": "janedoe",
      "name": "Jane Doe",
      "avatar": "https://via.placeholder.com/150"
    }
  }
]
```

### Create Comment
```http
POST /api/comments
Authorization: Bearer <token>
Content-Type: application/json

{
  "postId": 1,
  "content": "This is my comment!"
}
```

**Response** (201 Created):
```json
{
  "id": 2,
  "content": "This is my comment!",
  "userId": 1,
  "postId": 1,
  "createdAt": "2026-11-11T10:30:00.000Z",
  "updatedAt": "2026-11-11T10:30:00.000Z",
  "user": {
    "id": 1,
    "username": "johndoe",
    "name": "John Doe",
    "avatar": "https://via.placeholder.com/150"
  }
}
```

### Update Comment
```http
PUT /api/comments/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Updated comment text"
}
```

### Delete Comment
```http
DELETE /api/comments/:id
Authorization: Bearer <token>
```

**Response**: 204 No Content

---

## Shares

### Share a Post
```http
POST /api/shares
Authorization: Bearer <token>
Content-Type: application/json

{
  "postId": 1,
  "caption": "Everyone should see this!"  // optional
}
```

**Response** (201 Created):
```json
{
  "id": 1,
  "userId": 1,
  "postId": 1,
  "caption": "Everyone should see this!",
  "createdAt": "2026-11-11T10:35:00.000Z",
  "user": {
    "id": 1,
    "username": "johndoe",
    "name": "John Doe",
    "avatar": "https://via.placeholder.com/150"
  },
  "post": {
    "id": 1,
    "content": "Original post content",
    "imageUrl": "https://example.com/image.jpg",
    "user": {
      "id": 2,
      "username": "janedoe",
      "name": "Jane Doe"
    }
  }
}
```

### Get Shares for a Post
```http
GET /api/shares/post/:postId
```

### Delete Share
```http
DELETE /api/shares/:id
Authorization: Bearer <token>
```

**Response**: 204 No Content

---

## Response Format

### Success Response
```json
{
  "data": { ... },
  "status": "success"
}
```

### Error Response
```json
{
  "error": "Error message describing what went wrong"
}
```

---

## Error Codes

| Status Code | Meaning |
|------------|---------|
| 200 | OK - Request succeeded |
| 201 | Created - Resource created successfully |
| 204 | No Content - Request succeeded, no content to return |
| 400 | Bad Request - Invalid input or validation error |
| 401 | Unauthorized - Invalid or missing token |
| 403 | Forbidden - Not authorized to perform action |
| 404 | Not Found - Resource doesn't exist |
| 500 | Internal Server Error - Something went wrong on server |

---

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

To get a token:
1. Register a new user via `POST /api/users`
2. Login via `POST /api/login`
3. Use the returned token in subsequent requests

**Token expires after 7 days.**

---

## Rate Limiting

Currently, there is no rate limiting implemented. In production, you should add rate limiting to prevent abuse.

---

## CORS

CORS is enabled for all origins. In production, configure to allow only specific origins.

---

## Data Validation

### Username
- 3-30 characters
- Must be unique

### Email
- Must be valid email format
- Must be unique

### Password
- Minimum 3 characters
- Hashed with bcrypt (10 salt rounds)

### Post Content
- 1-5000 characters
- Cannot be empty

### Comment Content
- 1-1000 characters
- Cannot be empty

---

## Pagination

**Note:** Pagination is not yet implemented. All requests return all results. For production, implement pagination for posts, comments, etc.

Example future implementation:
```
GET /api/posts?page=1&limit=20
```
