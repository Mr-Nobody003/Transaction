# Transaction Backend API

A secure, scalable RESTful API built with **Node.js, Express, TypeScript, and MongoDB (Mongoose)** for managing user accounts, processing secure financial transactions, and maintaining a robust ledger system.

## 🚀 Key Features

* **User Authentication & Authorization**:
  * Secure User Registration and Login.
  * JWT-based Authentication with HTTP-only Cookies and Bearer tokens.
  * Token Blacklist mechanism on Logout to prevent unauthorized access.
  * Role-based access control (differentiating normal users from System admin users).

* **Account Management**:
  * Create diverse accounts attached to a user profile.
  * Real-time aggregation of Account Balances natively via MongoDB Aggregation Pipelines (calculating totals from `CREDITED` and `DEBITED` records).

* **Transaction Processing**:
  * Secure initiation of funds transfer.
  * Only accept Transactions from known users.
  * Maintain an immutable ledger of transactions.
  * Specialized routes for System User fund initialization.

* **Email Notifications**:
  * Asynchronous email notifications processed decoupled from the main transaction flow using **Nodemailer** (e.g., successful transaction alerts, welcome emails).

## 🛠️ Technology Stack

* **Runtime:** Node.js
* **Framework:** Express.js 5.x
* **Language:** TypeScript
* **Database:** MongoDB
* **ODM:** Mongoose
* **Authentication:** JSON Web Tokens (JWT), bcryptjs
* **Dev Tools:** Nodemon, ts-node

## 🗂️ Project Structure

```
Backend/
├── src/
│   ├── config/        # Environment configurations and DB setup
│   ├── controllers/   # Request-response handling logic
│   ├── middlewares/   # JWT parsing, auth checking, and error handling
│   ├── models/        # Mongoose schemas (User, Account, Ledger, Token Blacklist)
│   ├── routes/        # API endpoint definitions
│   ├── services/      # External integrations (like Nodemailer logic)
│   ├── types/         # TypeScript interfaces and global types
│   ├── index.ts       # Express app initialization
│   └── server.ts      # Server bootstrap script
├── package.json
└── tsconfig.json
```

## ⚙️ Getting Started

### Prerequisites

Ensure you have the following installed:
* [Node.js](https://nodejs.org/) (v25+)
* [MongoDB](https://www.mongodb.com/) (Local or Atlas)

### Installation

1. **Clone the repository** (if applicable) or navigate to the project directory:
   ```bash
   cd Backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the `Backend` directory and define your settings:
   ```env
   PORT=3000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   # Add your specific Nodemailer credentials here
   ```

### Running the Application

* **Development Mode** (with hot-reload):
  ```bash
  npm run dev
  ```
* **Build Project**:
  ```bash
  npm run build
  ```
* **Production Mode**:
  ```bash
  npm start
  ```

## 📡 API Endpoints

### Auth `(/api/v1/auth)`
* `POST /register` - Register a new user
* `POST /login` - Login to an existing account
* `POST /logout` - Logout & Blacklist JWT token (Protected)

### Accounts `(/api/v1/accounts)`
* `POST /` - Create a new user account (Protected)
* `GET /` - Get user account (Protected)
* `GET /system` - Get System user account (System Admin Protected)
* `GET /balance/:accountId` - Fetch real-time total calculated balance for the logged in account (Protected)
* `GET /system/balance/:accountId` - Fetch real-time total calculated balance for any account (System Admin Protected)

### Transactions `(/api/v1/transactions)`
* `POST /send-funds` - Create/initiate a new transaction (Protected)
* `POST /accept` - Accept transactions (Protected)
* `POST /system/initialize-funds` - System User initialization transaction (System Admin Protected)

---

> _**Note**: Ensure the MongoDB instance is operational before attempting to interact with the API._

