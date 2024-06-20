# Course Management Platform

## Overview
This project is a course management platform designed to allow instructors to create courses, register students, and upload course content. Students can view the courses they are registered in and access the course materials.

## Features
- Account creation (student, instructor)
- Login and logout
- Create a course (instructor)
- Register a student in a course (instructor)
- Upload course content (instructor)
- View course list (student, instructor)
- View course detail (student, instructor)
- Edit course fields (instructor)
- Delete material (instructor)
- Remove registerd students (instructor)
- Chat with in course with student (student)
- Download material (student)

## Technology Stack
- **Frontend:** HTML/CSS/JavaScript, React.js
- **Backend:** Node.js, Express.js
- **Database:** MongoDB

## Setup Instructions

### Prerequisites
- Node.js (https://nodejs.org/)
- MongoDB (https://www.mongodb.com/)

### Installation

1. **Clone the repository:**
   ```sh
   git clone "URL of repo"
  - That is provided in github.
   
2. **Install frontend dependencies:**
    ```sh
    cd frontend
    npm i --force
    
3. **Install server dependencies:**
    ```sh
    cd server
    npm i --force

4. **Start server**
   ```sh
   node server.js

5. **Now connect mongodb compass**
   - copy url from .env file
   - create new connection and add that url in that and click on connect

6. **Start frontend**
   ```sh
   npm start
