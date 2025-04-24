# Library App

## Description
Library App is a Node.js web application built with Express.js and EJS templating. It provides a platform for managing books, authors, and borrowing records. The app includes user authentication with signup and signin functionality, session management, and password hashing for security. It connects to a MySQL database to store user, book, author, and borrowing data.

## Features
- User registration and login with secure password hashing (bcrypt)
- Session-based authentication and authorization
- Browse authors and books with detailed views
- Borrow books with availability checks
- Admin-restricted routes for adding new authors and approving users
- Upload book cover images using multer
- User profile page showing borrowed books and borrowing history
- Pagination and error handling with a custom 404 page

## Technologies Used
- Node.js
- Express.js
- EJS templating engine
- MySQL database
- bcrypt for password hashing
- express-session for session management
- multer for file uploads

## Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd Library-App
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up a MySQL database named `librarydb` and configure the connection in `index.js` if needed.
5. Ensure the `public/images/covers` directory exists for book cover uploads.

## Usage
1. Start the application:
   ```bash
   node index.js
   ```
2. Open your browser and go to:
   ```
   http://localhost:8000
   ```
3. Use the signup page to create a new user account.
4. Sign in to access profile, borrow books, and other features.
5. Admin user (email: john@gmail.com) has access to additional routes for managing authors and users.

## Folder Structure
```
Library-App/
├── index.js               # Main application file
├── package.json           # Project dependencies and scripts
├── public/                # Static assets (CSS, images)
│   ├── css/
│   └── images/
│       └── covers/        # Uploaded book cover images
├── views/                 # EJS templates for rendering pages
│   ├── authors.ejs
│   ├── book.ejs
│   ├── books.ejs
│   ├── borrow.ejs
│   ├── header.ejs
│   ├── index.ejs
│   ├── profile.ejs
│   ├── signin.ejs
│   ├── signup.ejs
│   ├── updateprofile.ejs
│   └── 404.ejs
└── README.md              # Project documentation
```

## License
This project is licensed under the MIT License.

## Contact
For any questions or feedback, please contact the project maintainer.
