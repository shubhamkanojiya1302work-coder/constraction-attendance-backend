import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "../config/db.js";


dotenv.config();

const app = express();

// Middlewares
app.use(cors({
  origin: `${process.env.FRONTEND_URL}`
}));

app.use(express.json());

// Test API
app.get("/api/health", (req, res) => {
  res.json({
    message: "Construction Attendance API is running!"
  });
});

app.get("/api/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      message: "Database connected successfully!",
      time: result.rows[0].now
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Database connection failed"
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 