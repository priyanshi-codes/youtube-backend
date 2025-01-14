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

## Middleware

Middleware functions are used to handle various tasks such as authentication, error handling, and request validation. The middleware functions are located in the `src/middleware/` directory.

## Cloudinary Integration

Cloudinary is used for managing and storing media files such as images and videos. The integration with Cloudinary is set up to handle file uploads and storage.

### Setting Up Cloudinary

1. Install the Cloudinary package:
    ```sh
    npm install cloudinary
    ```

2. Configure Cloudinary in your project. Create a `cloudinary.js` file in the  directory with the following content:
    ```javascript
    import { v2 as cloudinary } from 'cloudinary';

    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    export default cloudinary;
    ```

3. Add the following environment variables to your  file:
    ```properties
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret
    ```

Replace `your_cloud_name`, `your_api_key`, and `your_api_secret` with your actual Cloudinary credentials.

### Using Cloudinary

You can now use Cloudinary in your controllers to upload and manage media files. For example, in a controller file:

```javascript
import cloudinary from '../utils/cloudinary.js';

const uploadImage = async (req, res) => {
    try {
        const result = await cloudinary.uploader.upload(req.file.path);
        res.json({ url: result.secure_url });
    } catch (error) {
        res.status(500).json({ error: 'Failed to upload image' });
    }
};
```

## Authentication

The project uses JWT (JSON Web Tokens) for authentication. It includes access tokens and refresh tokens to manage user sessions securely.

### Access Token

An access token is a short-lived token used to authenticate requests to protected routes. It is typically included in the `Authorization` header of HTTP requests.

### Refresh Token

A refresh token is a long-lived token used to obtain a new access token when the current access token expires. It is typically stored securely on the client side and sent to the server when requesting a new access token.

### Environment Variables

Add the following environment variables to your `.env` file to configure JWT secrets and expiry times:

```properties
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=7d
```

### Generating Tokens

Tokens are generated using the jsonwebtoken package. Here is an example of how to generate access and refresh tokens:

```javascript
import jwt from 'jsonwebtoken';

const generateAccessToken = (user) => {
    return jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
};

const generateRefreshToken = (user) => {
    return jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY });
};
```
Using Tokens
When a user logs in or registers, the server generates an access token and a refresh token. The access token is sent to the client and used for subsequent requests to protected routes. The refresh token is stored securely on the client side and used to obtain a new access token when needed.

## Controllers

Controllers handle the logic for different routes in the application. They are located in the `src/controllers/` directory.

### User Controller

The user controller handles user-related operations such as registration, login, profile management, and updating user details. The user controller is located in the `src/controllers/user.controller.js` file.

#### User Registration

The user registration functionality allows new users to register by providing their details. The registration logic is implemented using the `asyncHandler` utility to handle asynchronous operations and the `ApiResponse` utility to format the response.

#### User Profile Management

The user controller includes several functions to manage user profiles:

##### Change Current Password

Allows users to change their current password by providing the old and new passwords.

##### Get Current User
Fetches the details of the currently authenticated user.

##### Update User Details
Updates the details of the currently authenticated user, such as fullname, email, and username.

##### Update User Avatar
Allows users to update their avatar by uploading a new image.

##### Update User Cover Image
Allows users to update their cover image by uploading a new image.



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
