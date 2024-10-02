// routes/alerts.ts

import { Router } from "express";
import { verifyToken } from "../middleware/auth";  // Middleware to authenticate user
import Alert from "../models/Alert";  // Alert model
import { sendAlertEmail } from "../utils/sendEmail";  // Function to send email

const router = Router();

// POST endpoint to set an alert
router.post("/set", verifyToken, async (req, res) => {
  const { coinId, priceThreshold, volumeThreshold } = req.body;
  const userId = req.user.id;  // Authenticated user's ID
  
  if (!coinId || !priceThreshold || !volumeThreshold) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    // Create and save alert in the database
    const newAlert = new Alert({
      userId,
      coinId,
      priceThreshold,
      volumeThreshold,
    });
    
    await newAlert.save();
    return res.status(201).json({ message: "Alert set successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Server error." });
  }
});

export default router;
