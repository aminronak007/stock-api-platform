# stock-api-platform

This is stock api platform

## 📦 Features

- Express.js server
- MongoDB with Mongoose
- Centralized logging with Winston
- Google and Github Login using oAuth
- Environment-based configuration
- Error handling middleware
- Token based authentication and authorization
- API routing structure
- Rate Limiting
- Request validation with `validator`

## 🛠️ Project Structure

project/
├── src/
│ ├── config/
│ │ └── db.config.js
│ ├── controllers/
│ ├── middlewares/
│ ├── models/
│ ├── routes/
│ ├── utils/
│ │ └── logger.js
│ └── app.js
│ └── server.js
├── .env
├── server.js
└── README.md

## ⚙️ Prerequisites

- Node.js >= 18
- MongoDB installed and running

# Git clone the repository first

git clone https://github.com/username/repository_name

## Setup & Installation

# Run Below Command in the root folder in terminal to instal dependencies

npm i

# Also install nodemon globally in your laptop or pc (if not install)

npm i nodemon -g

# Create .env in the root and copy the all the environment variables from .env.example file to .env

.env

# Add all the neccessary credentials such as google outh credentials, stripe credentials, mongodb connection string (if using atlas), etc.

## How to run the project

npm run dev

# 🚀 CONGRATULATIONS your project will successfully run

🪵 Logging (Winston)
Logs are saved to:
logs/combined.log (all logs)
logs/error.log (only errors)
logs/exceptions.log (uncaught exceptions)
Console output (colorized for dev)

📬 API Routes
Base URL: http://localhost:8082/api/v1
