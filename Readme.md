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
