import express from "express";
import Show from "../models/show.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const bookedDates = await Show.find({}, { date: 1, city: 1 }).populate(
      "city"
    );
    res.status(200).json({ response: bookedDates, success: true });
  } catch (error) {
    res.status(400).json({ response: error });
  }
});

export default router;
