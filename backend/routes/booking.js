import express from "express";
import City from "../models/city.js";
import Show from "../models/show.js";
import {
  qualifiesForOvernight,
  getNearByCities,
  stripAwayWeekends,
} from "../utils/functions.js";
import nodemailer from "nodemailer";

const router = express.Router();

Date.prototype.withoutTime = function () {
  var d = new Date(this);
  d.setHours(10, 0, 0, 0);
  return d;
};

// ---- Get route ---
router.get("/", async (req, res) => {
  const { city, date } = req.query;
  console.log("this are the query", city, date);
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

  // code for nodemailer to send an e-mail
  const main = async () => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.office365.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: "VRbinoklis@outlook.com", // your e-mail
        pass: "siemens35",
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Binoklis" <VRbinoklis@outlook.com>', // sender address
      to: email, // list of receivers
      subject: "We received your booking", // Subject line
      text: "Thank you very much for the booking. Someone form our company will get in touch with you in next 2 days", // plain text body
      html: `<div><h1>VR show is coming your way</h1><p>Thank you very much for your order. We have registered it and someone form the company will get in touch with you in next two days. If you have any other questions, please write to us at reinis@binoklis.eu</p>`, // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  };
  main().catch(console.error);
});

export default router;
