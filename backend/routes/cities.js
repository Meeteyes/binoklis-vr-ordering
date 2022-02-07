import express from "express";
import City from "../models/city.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const cityList = await City.find({}, { cityName: 1 });
    res.status(200).json({ response: cityList, success: true });
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
});

export default router;
