<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Poppins&size=24&pause=1000&color=7C3AED&center=true&vCenter=true&width=900&lines=Complete+MCQ+Management+Backend+API;Question+Bank+Management;Categories+%26+Subcategories;JWT+Authentication+%7C+Role-Based+Access;Node.js+%7C+Express.js+%7C+MongoDB"/>
</p>

> A production-style backend application built with **Node.js, Express.js, MongoDB, and JWT Authentication** that allows users to register, verify their email, manage profiles, browse categorized multiple-choice questions, submit answers, and generate analytics using MongoDB Aggregation.

<p align="center">
  <img src="https://skillicons.dev/icons?i=nodejs,express,mongodb,javascript,vscode,git,github,postman" />
</p>

---

# 📌 Project Overview

The **Q&A Management System API** is a RESTful backend application designed for online assessments, quizzes, and learning platforms.

Users can securely register, verify their email, browse questions by category, submit answers, and track their responses. The system also provides analytical reports using MongoDB Aggregation Pipelines without using `populate()` or raw JavaScript queries.

This project demonstrates real-world backend development concepts such as authentication, file uploads, aggregation, and many-to-many relationships.

---

# 🎯 Project Objective

The objective of this project is to build a secure Question & Answer Management System where users can:

- Register with email verification
- Login securely
- Manage their profile
- Upload profile pictures
- Browse questions by category
- Submit answers
- Search answered questions
- Generate category-wise reports

---

# 🚀 Business Scenario

Imagine an online learning platform where students need to complete multiple-choice assessments.

The platform should allow students to:

- Create an account
- Verify their email
- Access categorized MCQ questions
- Submit answers
- View submitted responses
- Search previous answers

Administrators should be able to analyze:

- Number of questions in each category
- User submissions
- Category statistics

MongoDB Aggregation is used to generate these reports efficiently.

---

# ✨ Features

## 🔐 Authentication

- User Registration
- Email Verification
- Secure Login
- JWT Authentication
- Password Hashing (bcrypt)
- Protected Routes

---

## 👤 User Profile

Users can

- View Profile
- Update Profile
- Upload Profile Picture

---

## 📚 Category Module

- List All Categories
- Total Question Count per Category
- Category-wise Questions

---

## ❓ Question Module

- Multiple Choice Questions
- Questions assigned to multiple categories
- List Questions by Category

---

## ✅ Answer Module

Users can

- Submit Answers
- View Submitted Answers
- Search Answers
- Submission Time based on User Timezone

---

# 📊 MongoDB Aggregation

This project uses MongoDB Aggregation instead of `populate()`.

Aggregation is used for:

- Questions by Category
- Search Questions with Submitted Answers
- Category-wise Question Count
- User Answer Reports

---

# 🛠 Tech Stack

### Backend

- Node.js
- Express.js

### Database

- MongoDB
- Mongoose

### Authentication

- JWT
- bcrypt

### File Upload

- Multer
- Cloudinary

### Email

- Nodemailer

### API Testing

- Postman

---

# 📂 Project Structure

```text
app
│
├── config
│   ├── db.js
│   ├── cloudinary.js
│   └── emailVerify.js
│
├── controller
│   ├── auth.controller.js
│   ├── q&a.controller.js
│   └── user.controller.js
│
├── middleware
│   ├── auth.js
│   ├── allowRoles.js
│   └── fileUploades.js
│
├── model
│   ├── userModel.js
│   ├── categoryModel.js
│   ├── questionModel.js
│   ├── answerModel.js
│   └── otpModel.js
│
├── routes
│   ├── auth.routes.js
│   ├── qa.routes.js
│   ├── user.routes.js
│   └── index.js
│
├── utils
│   ├── sendEmail.js
│   └── httpStatusCode.js
│
├── app.js
│
public/
upload/
views/
Postman-Response/

package.json
```

---

# 🗄 Database Collections

## Users

```javascript
{
    name,
    email,
    password,
    profileImage,
    isVerified
}
```

---

## Categories

```javascript
{
    categoryName
}
```

---

## Questions

```javascript
{
    question,
    options,
    correctAnswer,
    categories:[]
}
```

---

## Answers

```javascript
{
    userId,
    questionId,
    selectedAnswer,
    submittedAt
}
```

---

# 🌐 API Modules

## 🔐 Authentication

- Register
- Verify Email
- Login

---

## 👤 User

- Get Profile
- Update Profile
- Upload Profile Picture

---

## 📚 Categories

- List Categories
- Category Question Count

---

## ❓ Questions

- Questions by Category
- Search Questions

---

## ✅ Answers

- Submit Answer
- Search Submitted Answers
- User Answer History

---

# 📈 Skills Demonstrated

- JWT Authentication
- Email Verification
- Cloudinary Integration
- MongoDB Aggregation
- Many-to-Many Relationships
- CRUD Operations
- Express.js
- MVC Architecture
- REST API Development
- File Upload
- Search APIs

---

# 🎓 Learning Outcomes

Building this project helped me understand:

- Authentication using JWT
- Email Verification Workflow
- MongoDB Aggregation Pipelines
- File Upload Handling
- MongoDB Relationships
- Backend API Design
- Search & Filtering
- User Timezone Handling

---

# 🚀 Future Improvements

- Admin Dashboard
- Role-Based Access Control (RBAC)
- Pagination
- Leaderboard
- Quiz Timer
- Swagger Documentation
- Unit Testing
- Docker Support

---

# ▶ Installation

Clone the repository

```bash
git clone https://github.com/your-username/qa-management-system-api.git
```

Install dependencies

```bash
npm install
```

Create a `.env` file

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

EMAIL=your_email

EMAIL_PASSWORD=your_email_password

CLOUDINARY_CLOUD_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=
```

Run the server

```bash
npm run dev
```

---

# 💼 Skills for Resume

This project demonstrates practical experience with:

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- MongoDB Aggregation
- Cloudinary
- Nodemailer
- REST APIs
- MVC Architecture
- File Upload
- Backend Development

---

# 👨‍💻 Author

## Raktim Bhattacharya

**Backend Developer**

### 💻 Tech Stack

Node.js • Express.js • MongoDB • JavaScript • REST APIs

---

## ⭐ Support

If you found this project helpful, consider giving it a ⭐ **Star** on GitHub.
