# CogniContent - An Intelligent Content Management System

CogniContent is a modern, AI-powered Content Management System (CMS) designed to go beyond traditional capabilities. It incorporates intelligent features to enhance content creation, streamline organization, and improve user discovery and engagement. This backend provides a robust, scalable, and secure API to power the entire platform.

## Table of Contents
1.  [Problem Specification & Approach](#problem-specification--approach)
2.  [Core Intelligent Features](#core-intelligent-features)
3.  [Technology Stack](#technology-stack)
4.  [Key Architectural Decisions](#key-architectural-decisions)
5.  [Folder Structure](#folder-structure)
6.  [API Endpoint Documentation](#api-endpoint-documentation)
7.  [Technical Considerations](#technical-considerations)
8.  [Setup and Installation](#setup-and-installation)
9.  [Postman Collection](#postman-collection)

## Problem Specification & Approach

The goal was to build a content platform that actively assists creators and provides a superior experience for readers. The approach was to build a standard, robust Node.js/Express API for core CMS functionalities (like CRUD operations) and then layer "intelligent" features on top. These features leverage Natural Language Processing (NLP) and data analysis to automate tasks, provide insights, and enhance discoverability, differentiating the platform from a basic blog or CMS.

## Core Intelligent Features

*   **AI-Powered Content Tagging & Categorization:** Automatically analyzes new content to suggest relevant tags and assign it to the most appropriate, pre-defined category. This saves creators time and ensures consistent organization.
*   **Real-time Content Optimization:** A dedicated endpoint provides live feedback to writers as they type, analyzing the text for word count, estimated reading time, and suggesting relevant tags and categories on the fly.
*   **Intelligent Search & Discovery:** The API supports full-text search and includes an endpoint to find related articles based on shared categories and tags, encouraging user engagement and content exploration.
*   **Automated Role Management:** A built-in workflow allows users to request "creator" access, which can be reviewed and approved by an administrator, automating the process of promoting readers to content creators.

## Technology Stack

| Category      | Technology                                    | Reasoning                                                                                                                             |
|---------------|-----------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------|
| **Core**      | **Node.js**, **Express.js**                   | A proven, high-performance stack for building scalable and efficient REST APIs. The event-driven, non-blocking I/O model is ideal for a CMS. |
| **Database**  | **MongoDB** with **Mongoose**                 | A NoSQL database provides the flexibility needed for evolving content structures. Mongoose offers powerful schema validation and middleware. |
| **Auth**      | **JSON Web Tokens (JWT)**, **bcrypt.js**        | JWT provides a stateless, secure method for authenticating API requests. Bcrypt is the industry standard for password hashing.            |
| **AI / NLP**  | **`natural`**, **`@mozilla/readability`**, **`jsdom`** | The `natural` library provides powerful and efficient NLP tools (like TF-IDF) directly within Node.js. `readability` is excellent for parsing HTML and calculating metrics like word count. |
| **File Uploads**| **`multer`**, **`cloudinary`**              | `multer` is a robust middleware for handling `multipart/form-data`. Cloudinary provides a scalable, cloud-based solution for image storage and delivery. |

## Key Architectural Decisions

*   **Service-Oriented Architecture:** The business logic is separated into a `service` layer, which is called by the `controller`. This makes the code more modular, easier to test, and reusable. Controllers are kept lean, only responsible for handling the HTTP request/response cycle.
*   **Combined File Uploads:** We made a key decision to combine the file upload with the content creation (`POST /content`) rather than using a separate upload route. This simplifies the frontend workflow into a single API call, although it makes the backend request slightly more complex (handling `multipart/form-data`).
*   **Denormalization for Performance:** In the `Content` model, we store denormalized counts like `viewsCount`, `likesCount`, and `commentsCount`. While the "source of truth" is in the `Like` and `Comment` collections, these stored counts allow for extremely fast reads when fetching lists of content, avoiding expensive database lookups.
*   **Flexible Role-Based Security:** We implemented a flexible `checkRole` middleware that accepts an array of allowed roles. This is more scalable than creating a separate middleware for every role combination and allows us to easily protect routes for specific user types.

## Folder Structure

The project follows a feature-based folder structure, which keeps related code organized and easy to locate.

```
/src
|-- /core              # Core application setup (app, router, middleware)
|-- /entities          # Main business logic, organized by feature
|   |-- /auth          # User registration, login, models
|   |-- /content       # Content creation, analysis, models
|   |-- /interactions  # Likes, follows, comments
|   |-- /analytics     # Trending, content performance
|   |-- /request       # Creator access request workflow
|   |-- ... (other features)
|-- /lib               # Reusable libraries and utilities (e.g., response formatter)
```

## API Endpoint Documentation

A complete and interactive documentation for all API endpoints is available via Postman:

**[View the Postman Documentation](https://documenter.getpostman.com/view/40583921/2sB3HkpKmn)**

A summary of all routes is provided below.

### Auth (`/api/v1/auth`)
*   `POST /register`: Register a new user (defaults to 'reader' role).
*   `POST /login`: Login a user and receive a JWT.

### Users & Profiles (`/api/v1/users`)
*   `GET /me`: Get the profile of the currently logged-in user.
*   `PUT /me`: Update the profile of the currently logged-in user.
*   `GET /:userId/content`: Get all published content for a specific user.

### Content (`/api/v1/content`)
*   `POST /`: Create new content. Can include a `featuredImage` file.
*   `GET /`: Get all published content with search and pagination.
*   `GET /:id`: Get a single piece of content by its ID.
*   `PUT /:id`: Update a piece of content. (Author or Admin only)
*   `DELETE /:id`: Delete a piece of content. (Author or Admin only)
*   `POST /analyze`: Get real-time analysis of a piece of text.
*   `GET /:id/related`: Get a list of content related to a specific article.

### Interactions (`/api/v1/interactions`)
*   `POST /like/:contentId`: Like or unlike a piece of content.
*   `POST /follow/:userId`: Follow or unfollow a user.
*   `POST /comments/:contentId`: Add a comment to a piece of content.
*   `GET /comments/:contentId`: Get all comments for a piece of content.
*   `PUT /comments/:commentId`: Update your own comment.
*   `DELETE /comments/:commentId`: Delete your own comment.

### Analytics (`/api/v1/analytics`)
*   `GET /content/:contentId`: Get performance metrics for a piece of content.
*   `GET /trending`: Get a list of the current top 5 trending articles.

### Creator Access Requests (`/api/v1/creator`)
*   `POST /request-access`: Allows a 'reader' to request an upgrade to 'creator'.
*   `GET /requests`: (Admin only) Get a list of all pending creator requests.
*   `PUT /requests/:userId/approve`: (Admin only) Approve a request and upgrade a user to 'creator'.
*   `PUT /requests/:userId/reject`: (Admin only) Reject a creator request.

## Technical Considerations

*   **Content Structure:** Content is structured in MongoDB with a flexible schema that includes core fields (`title`, `body`), metadata, AI-generated tags, optimization scores, and denormalized interaction counts. This provides both scalability and high read performance.
*   **Intelligent Features:** The system is differentiated by its NLP-powered auto-tagging and category suggestions, real-time content analysis for writers, and a discovery mechanism for finding related content.
*   **Balancing Creator/User Needs:** For creators, the focus is on assistance and efficiency (auto-tagging, live feedback). For end-users, the focus is on discoverability and engagement (semantic search, related content, interaction features). The consistent categorization driven by the AI benefits both sides.
*   **Search and Recommendation:** Search is handled by MongoDB's built-in text indexing, which provides a powerful full-text search capability. Recommendations are currently based on finding other content with a shared category or tags, which is a simple but effective starting point.

### Trade-offs and Future Improvements

*   **Simple Recommendation Engine:** The current related content feature is effective but basic. With more time, this could be improved by implementing a more advanced collaborative filtering or content-based filtering algorithm, potentially using the `Analytics` data to see which articles are frequently viewed together.
*   **Admin Panel:** Many administrative tasks (like creating categories or approving creator requests) currently require direct database access. A high-priority improvement would be to build a dedicated frontend admin dashboard to manage these tasks.
*   **Real-time Readability Score:** The `analyzeContent` endpoint is set up to be extensible. A great addition would be to integrate a library to calculate a Flesch-Kincaid readability score and provide even more granular feedback to writers.

## Setup and Installation

1.  Clone the repository: `git clone <repository-url>`
2.  Install dependencies: `npm install`
3.  Create a `.env` file in the root directory and add the required environment variables (see `index.js` and `config.js` for details).
4.  Start the server: `npm start` or `npm run dev` for nodemon.

## Postman Collection

A Postman collection with all the endpoints and example bodies is provided in the root of this project: `CogniContent.postman_collection.json`.
You can also view the documentation online: **[Postman Docs](https://documenter.getpostman.com/view/40583921/2sB3HkpKmn)**
