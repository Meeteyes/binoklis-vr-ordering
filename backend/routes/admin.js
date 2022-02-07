import express from "express";
import authenticateUser from "../utils/authenticateUser.js";
import Show from "../models/show.js";

const router = express.Router();

router.get("/", authenticateUser);
router.get("/", async (req, res) => {
  try {
    const shows = await Show.find({}).populate("city");
    if (shows) {
      res.status(200).json({ response: shows, success: true });
    } else {
      res.status(200).json({ response: "No shows found", success: true });
    }
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
});

export default router;
