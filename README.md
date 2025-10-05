# PIOSERVE Setup Guide

This guide will help you configure and run the **POS Frontend** and **POS Backend** properly on your machine.

**MAKE SURE YOUR BROWSER DOESNT BLOCK ADS FOR LICENSE TO WORK**

**TURN OF THE BRAVE SHIELD IF YOU ARE USING BRAVE BROWSER**

---

## 1. Pull the Latest Code Or Clone The Repo

Make sure you have the latest version of the project:
And Update The Dependencies

Clone

```bash
git clone https://github.com/jgdev101613/pioserve2.git
```

Pull

```bash
git pull
```

After pulling or cloning make sure to install the required dependencies

pos-frontend

```bash
npm install
```

pos-backend

```bash
npm install
```

## 1.5 Create app.js file

Inside pos-backend create a file called 'app.js' if the file is not there yet, then copy paste the code below.

```js
const express = require("express");
const connectDB = require("./config/database");
const config = require("./config/config");
const globalErrorHandler = require("./middlewares/globalErrorHandler");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { validateLicense } = require("./middlewares/licenseCheck.js");

const app = express();
const PORT = config.port;

// Connect DB
connectDB();

// Middlewares
app.use(
  cors({
    credentials: true,
    origin: [
      "http://localhost:5173", // local dev
      "http://192.168.1.5:5173", // Change to your IPv4 Address
      // If your IP is 192.168.2.101 then
      // Example: "http://192.168.2.101:5173"
    ],
  })
);
app.use(express.json());
app.use(cookieParser());

// Root Endpoint
app.get("/", (req, res) => {
  res.send("Licensed system is running 🚀");
});

// Other Endpoints
app.use("/api/user", require("./routes/userRoute"));
app.use("/api/order", require("./routes/orderRoute"));
app.use("/api/dish", require("./routes/dishRoute"));
app.use("/api/table", require("./routes/tableRoute"));
app.use("/api/payment", require("./routes/paymentRoute"));
app.use("/api/admin", require("./routes/adminRoute"));

app.get("/api/status", async (req, res) => {
  try {
    // Call my license server to confirm status again
    const axios = require("axios");
    const response = await axios.post(
      "https://jgdev-license-server.onrender.com/validate",
      {
        licenseKey: process.env.LICENSE_KEY,
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error("License re-check failed:", err.message);
    res.json({ valid: false, message: "License check failed" });
  }
});

// Global Error Handler
app.use(globalErrorHandler);

// ✅ Start server only if license is valid
async function startServer() {
  await validateLicense(); // ⛔ shuts down if invalid
  app.listen(PORT, () => {
    console.log(`☑️ POS Server is listening on port ${PORT}`);
  });
}

startServer();
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
LICENSE_KEY={LICENSE} // Request this from the developer then put the license here EG: LICENSE_KEY=JGDEV-LICENSEKEY
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
npm run dev
```

Frontend

```bash
cd pos-frontend
npm install
npm run dev -- --host
```
