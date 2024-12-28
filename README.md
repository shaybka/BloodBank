# BloodBank Management System

![License](https://img.shields.io/badge/license-MIT-blue.svg)

## Table of Contents
- [BloodBank Management System](#bloodbank-management-system)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Features](#features)
  - [Technologies Used](#technologies-used)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Environment Variables](#environment-variables)

## Introduction

The **BloodBank Management System** is a comprehensive backend application built with Node.js, Express, and MongoDB. It facilitates the management of blood donations, donors, hospitals, staff, and blood inventory. The system includes user authentication with role-based access control, ensuring that only authorized personnel can perform sensitive operations.

## Features

- **User Authentication:**
  - User registration and login.
  - Role-based access control (`user` and `admin` roles).
  - JWT-based authentication with secure token handling.

- **Hospital Management:**
  - CRUD operations for hospitals.
  - Partner status verification for hospitals.

- **Donor Management:**
  - CRUD operations for donors.
  - Donation history tracking.

- **Donation Management:**
  - Record and retrieve donation details.
  - Update blood inventory based on donations.

- **Blood Inventory Management:**
  - Manage blood inventory with different blood types.
  - Track storage location and expiry dates.

- **Blood Request Management:**
  - Hospitals can create blood requests.
  - Admins can manage and update request statuses.

- **Staff Management:**
  - Admins can manage staff members.
  - CRUD operations for staff profiles.

## Technologies Used

- **Backend:**
  - [Node.js](https://nodejs.org/)
  - [Express.js](https://expressjs.com/)
  - [MongoDB](https://www.mongodb.com/)
  - [Mongoose](https://mongoosejs.com/)
  - [JWT (jsonwebtoken)](https://github.com/auth0/node-jsonwebtoken)
  - [bcrypt](https://github.com/kelektiv/node.bcrypt.js)
  - [dotenv](https://github.com/motdotla/dotenv)
  - [Nodemon](https://github.com/remy/nodemon) (for development)

- **Other Tools:**
  - [Postman](https://www.postman.com/) (for API testing)
  - [Chalk](https://github.com/chalk/chalk) (for colorful console logs)

## Getting Started

### Prerequisites

- **Node.js** (v14 or later)
- **npm** (v6 or later)
- **MongoDB** (Ensure you have access to a MongoDB instance. You can use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for a cloud-based solution.)

### Installation

1. **Clone the Repository:**
    ```bash
    git clone https://github.com/yourusername/bloodbank.git
    cd bloodbank
    ```

2. **Install Dependencies:**
    ```bash
    npm install
    ```

### Environment Variables

Create a [.env](http://_vscodecontentref_/0) file in the root directory and add the following variables:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=8000