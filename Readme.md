# Youtube Backend

This is a backend for a similar youtube app made in Node.js, Express, and MongoDB.

## Project Overview

The project aims to create a backend for a YouTube-like application. It includes user authentication, video management, and other essential features.

## Project Structure

The project is organized into the following directories and files:

youtube_backend/ ├── .env ├── .gitignore ├── .prettierignore ├── .prettierrc ├── package.json ├── Readme.md ├── public/ │ └── temp/ │ └── .gitkeep └── src/ ├── app.js ├── constants.js ├── index.js ├── controllers/ ├── db/ │ └── index.js ├── middleware/ ├── models/ │ ├── user.model.js │ └── video.model.js ├── routes/ ├── utils/ │ ├── ApiError.js │ ├── ApiResponse.js │ └── asyncHandler.js

### Explanation of Key Files and Directories

- **`.env`**: Contains environment variables for the project.
- **`public/`**: Contains public assets and temporary files.
- **`src/`**: Contains the main source code for the application.
  - **`app.js`**: The main application file where the Express app is configured.
  - **`constants.js`**: Contains constant values used throughout the application.
  - **`index.js`**: The entry point of the application.
  - **`controllers/`**: Contains controller files for handling requests.
  - **`db/`**: Contains database connection logic.
    - **`index.js`**: Connects to the MongoDB database using Mongoose.
  - **`middleware/`**: Contains middleware functions.
  - **`models/`**: Contains Mongoose models for the application.
    - **`user.model.js`**: Defines the User model.
    - **`video.model.js`**: Defines the Video model.
  - **`routes/`**: Contains route definitions.
  - **`utils/`**: Contains utility functions and classes.
    - **`ApiError.js`**: Defines a custom error class for API errors.
    - **`ApiResponse.js`**: Defines a custom response class for API responses.
    - **`asyncHandler.js`**: A utility function for handling asynchronous route handlers.

## Current Progress

1. **Environment Setup**: The project is set up with necessary environment variables in the `.env` file.
2. **Database Connection**: The application connects to a MongoDB database using Mongoose.
3. **Models**: User and Video models are defined using Mongoose.
4. **Utilities**: Utility functions for error handling and API responses are implemented.

## Running the Project

1. Install the dependencies:
    ```sh
    npm install
    ```

2. Start the development server:
    ```sh
    npm run dev
    ```

## Environment Variables

Create a [.env](http://_vscodecontentref_/3) file in the root directory with the following content:

PORT=8000 MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net CORS_ORIGIN=*

ACCESS_TOKEN_SECRET=your_access_token_secret ACCESS_TOKEN_EXPIRY=1d REFRESH_TOKEN_SECRET=your_refresh_token_secret REFRESH_TOKEN_EXPIRY=7d

This Readme.md file provides an overview of the project, its structure, current progress, and instructions on how to run the project. It also includes information about environment variables and key files in the project.
