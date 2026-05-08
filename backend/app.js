require("dotenv").config();

const express = require("express");
const cors = require("cors");

const authRoutes = require("./src/routes/authRoutes");
const adminRoutes = require("./src/routes/adminRoutes");
const userRoutes = require("./src/routes/userRoutes");
const storeOwnerRoutes = require("./src/routes/storeOwnerRoutes");
const errorMiddleware = require("./src/middleware/errorMiddleware");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.json({ success: true, message: "Server is running." });
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/store-owner", storeOwnerRoutes);

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

module.exports = app;