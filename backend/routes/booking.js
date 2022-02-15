import express from "express";
import City from "../models/city.js";
import Show from "../models/show.js";
import {
  qualifiesForOvernight,
  getNearByCities,
  stripAwayWeekends,
  removeDuplicatesAndSort,
} from "../utils/functions.js";
// import nodemailer from "nodemailer";
import dotenv from "dotenv";

import { main } from "../utils/mailer.js";
const router = express.Router();
dotenv.config();

Date.prototype.withoutTime = function () {
  var d = new Date(this);
  d.setHours(10, 0, 0, 0);
  return d;
};

// ---- Get route ---
router.get("/", async (req, res) => {
  const { city, date } = req.query;
  if (city && date) {
    try {
      // we get the city List and the chosen city
      const cityList = await City.find({});
      const askedCity = await City.findOne({ cityName: city });
      if (!askedCity) {
        res
          .status(404)
          .json({ response: "No such city found", success: false });
      }
      // see if the city is far enough (boolean)
      const isOvernight = qualifiesForOvernight(askedCity);

      if (isOvernight) {
        // we get all the cities in 100 km radius and check if there are any upcoming shows in one of those cities
        const nearByCities = getNearByCities(cityList, askedCity, 100);
        let nearByShows = await Show.find({
          city: { $in: nearByCities },
        }).populate("city");

        // we filter only upcoming shows
        nearByShows = nearByShows.filter(
          (show) =>
            new Date(show.date).withoutTime().getTime() >
            new Date().withoutTime().getTime()
        );

        //we have to check if the previous or next date is not a weekend and return the possible dates
        let availableDatesAround = stripAwayWeekends(nearByShows);

        // double checks that there are no duplicates and sort the array by ascending date
        availableDatesAround = removeDuplicatesAndSort(availableDatesAround);

        //now we check if those possible dates are actually free
        availableDatesAround = await availableDatesAround.reduce(
          async (acc, date) => {
            const show = await Show.findOne({ date });
            //if no instance in MongoDB with such a date we push it to array which will be the final answer
            if (show === null) {
              return (await acc).concat(date);
            } else {
              return await acc;
            }
          },
          []
        );

        if ((await availableDatesAround.length) > 0) {
          // if the date client chose is also among the suggested/ optimized dates we do not offer the alternative/ discount
          if (availableDatesAround.includes(date)) {
            res.status(200).json({ response: [], success: true });
          } else {
            res
              .status(200)
              .json({ response: availableDatesAround, success: true });
          }
        } else {
          res.status(200).json({ response: [], success: true });
        }
      } else {
        res.status(200).json({ response: [], success: true });
      }
    } catch (error) {
      res.status(401).json({ response: error, success: false });
    }
  } else {
    res.status(400).json({
      response: "Must provide the city and the date as requests parameters",
      success: false,
    });
  }
});

// ------ Post route ----
router.post("/", async (req, res) => {
  const { city, address, date, contactPerson, phone, email } = req.body;
  if ((city, date, contactPerson, email)) {
    try {
      const queriedCity = await City.findOne({ cityName: city });
      const show = await new Show({
        city: queriedCity,
        address,
        date,
        contactPerson,
        phone,
        email,
      }).save();
      res.status(201).json({ response: show, success: true });
    } catch (error) {
      res.status(400).json({ response: error, success: false });
    }
  } else {
    res.status(400).json({
      response:
        "City, date, contactPerson and e-mail is required. Please provide this information and try again",
      success: false,
    });
  }

  main(email).catch(console.error);
});

export default router;
