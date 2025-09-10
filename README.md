# PIOSERVE Setup Guide

This guide will help you configure and run the **POS Frontend** and **POS Backend** properly on your machine.

---

## 1. Pull the Latest Code

Make sure you have the latest version of the project:

```bash
git pull
```

## 2. Environment Files Setup

You need to create .env files for both the backend and frontend.

Backend (pos-backend/.env)

Create a file named .env inside the pos-backend folder and add the following:

```
PORT=8000
MONGODB_URI=mongodb+srv://jgdev101613:jgadmin@pioserve.kuudjol.mongodb.net/?retryWrites=true&w=majority&appName=pioserve
JWT_SECRET=jgadmin123
RAZORPAY_KEY_ID=rzp_test_us_lUOr0zGAelD8XB
RAZORPAY_KEY_SECRET=NdzBpXd7DfMbta1MbghskmPL
RAZORPAY_WEBHOOK_SECRET=sda
```

Frontend (pos-frontend/.env)

Create a file named .env inside the pos-frontend folder and add the following:

```
VITE_BACKEND_URL=http://localhost:8000
VITE_RAZORPAY_KEY_ID=rzp_test_us_lUOr0zGAelD8XB
```

| ⚠️ Important: Change the localhost to your machine's IPv4 Address.

## 3. Find Your IPv4 Address

To find your IPv4 address:

Open Command Prompt (Windows) or Terminal (Linux/Mac).

Run:

```bash
ipconfig
```

Look for the IPv4 Address under your network connection.

Example IPv4 Address:

```nginx
IPv4 Address. . . . . . . . . . . : 192.168.1.101
```

Now update your frontend .env file like this:

```
VITE_BACKEND_URL=http://192.168.1.101:8000
```

## 4. Update Backend CORS

Open pos-backend/app.js and find the CORS middleware:

```js
// Middlewares
app.use(
  cors({
    credentials: true,
    origin: [
      "http://localhost:5173", // local dev
      "http://192.168.1.5:5173", // LAN dev (your machine's IP)
    ],
  })
);
```

Replace http://192.168.1.5:5173 with your own machine’s IPv4 address.

Example: "http://192.168.1.101:5173" do not remove the :5173

## 5. Run the Project

Backend

```bash
cd pos-backend
npm install
npm start
```

Frontend

```bash
cd pos-frontend
npm install
npm run dev -- --host
```
