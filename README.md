# 🌟 Store Rating & Analytics System
Demo link-https://drive.google.com/file/d/10c1nAe8_1mHCRZkA9owlTv4KIy-pxxx1/view?usp=sharing
A sophisticated, full-stack store rating platform featuring personal dashboards for Admins, Store Owners, and Users. Built with a high-end, premium aesthetic using React and Node.js.

## 🚀 Key Features

### 🛠️ Administrator Control Center
- **System-wide Analytics**: Real-time stats for total users, stores, and ratings.
- **User Management**: Add, manage, and monitor all platform participants (Admins, Owners, Users).
- **Store Inventory**: Register and organize stores within the system.
- **Search & Filtering**: Highly responsive filtering for all system entities.

### 🏪 Store Owner Dashboard
- **Performance Tracking**: Visual performance charts and average ratings across all owned stores.
- **Customer Feedback Loop**: Direct access to user reviews and ratings for each individual store node.
- **Node Management**: Quick initialization and monitoring of new store outlets.
- **Real-time Synchronization**: Instant reflection of customer signals periodically.

### 🔐 Multi-tier Security
- **Role-Based Access Control (RBAC)**: Distinct permissions for Admin, Owner, and basic User roles.
- **JWT Authentication**: Secure, token-based session management.
- **Advanced Field Validation**: Strict constraints on name (10-60 chars) and passwords (8-16 chars, 1 uppercase, 1 special char).

---

## 💻 Tech Stack

### Frontend
- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS 4 + Modern Glassmorphism Utilities
- **Animations**: Framer Motion
- **Iconography**: Lucide React
- **API Client**: Axios

### Backend
- **Environment**: Node.js
- **Framework**: Express 5 (Latest Build)
- **Database**: MySQL (using `mysql2/promise` for async performance)
- **Security**: BCryptJS for hashing, JWT for sessions

---

## 📂 Project Structure

```text
├── backend/            # Express Server, Controllers, Routes, and Database Schema
├── frontend/           # Vite + React Application with Premium UI
└── README.md           # Project Documentation
```

---

## 🛠️ Setup Instructions

### Prerequisites
- **Node.js** (v18+)
- **MySQL Server** (local or hosted)

### 1. Database Setup
1. Create a MySQL database named `store_rating_db`.
2. Configure your credentials in `backend/.env` (see below).

### 2. Backend Configuration
1. Navigate to the `backend/` directory.
2. Install dependencies: `npm install`
3. Create a `.env` file and add the following:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=your_user
   DB_PASSWORD=your_password
   DB_NAME=store_rating_db
   JWT_SECRET=your_super_secret_key
   JWT_EXPIRES_IN=1d
   ```
4. Seed the admin account: `node seedAdmin.js`
5. Run the server: `npm run dev`

### 3. Frontend Configuration
1. Navigate to the `frontend/` directory.
2. Install dependencies: `npm install`
3. Launch development server: `npm run dev`
4. Access the app at `http://localhost:5173`

---

## 🛡️ Default Admin Credentials
For testing and initial onboarding:
- **Email**: `admin@nexus.com`
- **Password**: `Admin@Nexus123`

---

## 🤝 Contact / Author
Developed for a company assessment mission. Focus on code quality, performance, and UI/UX excellence.
