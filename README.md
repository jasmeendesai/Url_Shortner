# Custom URL Shortener API

## Overview
The **Custom URL Shortener API** is a scalable service designed to create and manage short URLs efficiently. It supports **Google Sign-In authentication**, **advanced analytics**, **rate limiting**, and **topic-based URL categorization**. The system is optimized for **cloud deployment** and leverages **Redis caching** for performance improvements.

---

## Features
- **User Authentication**: Secure login using Google Sign-In.
- **Short URL Generation**: Convert long URLs into short, easy-to-share links.
- **Custom Alias & Topics**: Users can specify custom aliases and categorize URLs.
- **Redirect & Tracking**: Redirect users and log analytics data (IP, user agent, geolocation, etc.).
- **Comprehensive Analytics**:
  - Individual URL analytics
  - Topic-based analytics
  - Overall analytics for a user’s links
- **Rate Limiting**: Restrict URL creation frequency per user.
- **Caching with Redis**: Improve API response time and reduce database load.

---

## Tech Stack
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: Google OAuth 2.0
- **Caching**: Redis
- **Deployment & Scaling**: Docker, AWS
- **API Documentation**: Swagger

---
## API Endpoints

### 1. **User Authentication**
- **POST /api/auth/google** – Authenticate using Google Sign-In.

### 2. **Short URL Generation**
- **POST /api/shorten** – Generate a short URL.
  - Request:
    ```json
    {
      "longUrl": "https://example.com",
      "customAlias": "my-link",  
      "topic": "acquisition"
    }
    ```
  - Response:
    ```json
    {
      "shortUrl": "https://short.ly/my-link",
      "createdAt": "2025-02-26T12:00:00Z"
    }
    ```

### 3. **Redirect Short URL**
- **GET /api/shorten/{alias}** – Redirects to the original URL and logs analytics.

### 4. **URL Analytics**
- **GET /api/analytics/{alias}** – Retrieve analytics for a specific short URL.
- **GET /api/analytics/topic/{topic}** – Get analytics for URLs under a topic.
- **GET /api/analytics/overall** – Get overall analytics for all URLs created by the user.

### 5. **Rate Limiting**
- Limits the number of URLs a user can generate within a specific time.

### 6. **Caching**
- Uses Redis to store short URLs and analytics for quick access and performance optimization.

---

## Docker Deployment

### Build and Run with Docker
```sh
docker-compose up --build
```

