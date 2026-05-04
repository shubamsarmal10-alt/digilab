# DigiLib+ Database Schema (MongoDB)

This document outlines the NoSQL data structure for the DigiLib+ Advanced Digital Library Management System.

## Collections

### 1. `users`
Stores information about library users (Students, Faculty, Admins).
```json
{
  "_id": "ObjectId",
  "name": "string",
  "email": "string",
  "role": "string", // ["admin", "member"]
  "isBlocked": "boolean",
  "joinedAt": "ISODate",
  "activityLog": [
    {
      "action": "string",
      "timestamp": "ISODate"
    }
  ]
}
```

### 2. `books`
Stores the library catalog.
```json
{
  "_id": "ObjectId",
  "title": "string",
  "author": "string",
  "category": "string",
  "isbn": "string",
  "quantity": "number",
  "availableQuantity": "number",
  "chapters": [
    {
      "title": "string",
      "contentUrl": "string"
    }
  ],
  "ratings": [
    {
      "userId": "string",
      "rating": "number",
      "comment": "string",
      "timestamp": "ISODate"
    }
  ],
  "averageRating": "number"
}
```
*Note: A text index is applied to `title` and `author` for search functionality.*

### 3. `transactions` (Issues)
Tracks book checkout and return history.
```json
{
  "_id": "ObjectId",
  "bookId": "ObjectId",
  "userId": "string", // matching currentUser name or email
  "issueDate": "ISODate",
  "dueDate": "ISODate",
  "returnDate": "ISODate", // null if not returned
  "status": "string" // ["issued", "returned", "overdue"]
}
```

### 4. `analytics`
Stores aggregated data for the admin dashboard.
```json
{
  "_id": "string", // e.g., "most_read_books"
  "data": "array",
  "lastUpdated": "ISODate"
}
```

## Performance & Optimization
- **Indexes**:
  - `books`: Text index on `{ title: "text", author: "text" }`.
  - `transactions`: Compound index on `{ userId: 1, status: 1 }`.
  - `users`: Unique index on `email`.
- **Aggregation Pipelines**:
  - Used for generating real-time stats (e.g., total books, active issues, popular categories).
- **Transactions**:
  - Multi-document transactions used during book issue to ensure atomic updates to `books.availableQuantity` and `transactions` collection.
