import express from "express";
import cors from "cors";
import mongoose from "mongoose";

///---- MONGO DB ---
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/binoklis";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// ---- Schema for the Order ------
const ShowSchema = new mongoose.Schema({
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "City",
    required: true,
  },
  address: {
    type: String,
    trim: true,
  },
  date: {
    type: String,
    required: true,
  },
  contactPerson: {
    type: String,
    trim: true,
    required: true,
  },
  phone: {
    type: String,
    trim: true,
    minlenght: "8",
    maxlength: "8",
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    required: "Email address is required",
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },
});

// ---- Schema for the Cities -----
const CitySchema = new mongoose.Schema({
  cityName: {
    type: String,
    required: true,
    unique: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
});

const Show = new mongoose.model("Show", ShowSchema);
const City = new mongoose.model("City", CitySchema);

Date.prototype.withoutTime = function () {
  var d = new Date(this);
  d.setHours(10, 0, 0, 0);
  return d;
};

// compares the distances between the show City and rest of the cities, and returns the cities in 70km radius
const getNearByCities = (cityList, showCity, radius) => {
  let result = cityList.filter((item) => {
    // console.log(showCity.latitude);
    const distance = calculateDistance(
      item.latitude,
      item.longitude,
      showCity.latitude,
      showCity.longitude
    );
    return distance <= radius;
  });
  return result;
};

// standart function that compares two locations and tells the distance between them in km
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  lon1 = (lon1 * Math.PI) / 180;
  lon2 = (lon2 * Math.PI) / 180;
  lat1 = (lat1 * Math.PI) / 180;
  lat2 = (lat2 * Math.PI) / 180;

  // Haversine formula
  let dlon = lon2 - lon1;
  let dlat = lat2 - lat1;
  let a =
    Math.pow(Math.sin(dlat / 2), 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon / 2), 2);

  let c = 2 * Math.asin(Math.sqrt(a));

  // Radius of earth in kilometers
  let r = 6371;

  // calculate the result
  return c * r;
};

// checks if the asked city is far enough from base (Riga) to consider overnight stay
const qualifiesForOvernight = (showCity) => {
  // here we assign the lat, lon of the base city which is Riga
  const [baseLat, baseLon] = [56.971149, 24.142749];
  const distance = calculateDistance(
    baseLat,
    baseLon,
    showCity.latitude,
    showCity.longitude
  );
  if (distance >= 100) {
    return true;
  } else {
    return false;
  }
};

// function that checks one day forward and one day back (eliminating the days that are on weekend)
const stripAwayWeekends = (array) => {
  console.log("Inside the strip function");
  const result = [];
  array.forEach((show) => {
    // we get the previous and next day and strip away the time, so only date remains

    let previousDay = new Date(show.date).withoutTime();
    previousDay.setDate(previousDay.getDate() - 1);
    previousDay = previousDay.withoutTime().toDateString();
    console.log("Inside the strip function --- previousDay ", previousDay);

    let nextDay = new Date(show.date).withoutTime();
    nextDay.setDate(nextDay.getDate() + 1);
    nextDay = nextDay.withoutTime().toDateString();
    console.log("Inside the strip function --- nextDayDay ", nextDay);

    if (
      previousDay.substr(0, 3) === "Sat" ||
      previousDay.substr(0, 3) === "Sun"
    ) {
      console.log("Date is on weekend, do nothing");
    } else {
      result.push(previousDay);
    }

    if (nextDay.substr(0, 3) === "Sat" || nextDay.substr(0, 3) === "Sun") {
      console.log("Date is on weekend, do nothing");
    } else {
      result.push(nextDay);
    }
  });
  console.log("result is : ", result);
  return result;
};

const port = process.env.PORT || 8080;
const app = express();

app.use(cors());

app.use(express.json());

// path that provides all the cities of Latvia that are in DB
app.get("/cities", async (req, res) => {
  try {
    const cityList = await City.find({}, { cityName: 1 });
    res.status(200).json({ response: cityList, success: true });
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
});

// This path returns an aray with dates that are already booked
app.get("/bookedDates", async (req, res) => {
  try {
    console.log("HAPPENING");
    const bookedDates = await Show.find({}, { date: 1, city: 1 }).populate(
      "city"
    );
    console.log(bookedDates);
    res.status(200).json({ response: bookedDates, success: true });
  } catch (error) {
    res.status(400).json({ response: error });
  }
});

// path that posts a new Show on the DB
app.post("/booking", async (req, res) => {
  const { city, address, date, contactPerson, phone, email } = req.body;
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
    console.log("This is executed");
    res.status(400).json({ response: error, success: false });
  }
});

// this path returns alternative dates for the show. Should be used before booking of the show to optimize the logistics
app.get("/booking", async (req, res) => {
  const { city, date } = req.query;
  const dateInText = new Date(date).withoutTime().toDateString();
  console.log(
    "This is the city from params: ",
    city,
    " This is the date from params : ",
    date,
    " And in text format it is : ",
    dateInText
  );

  try {
    // we get the city List and The chosen city
    const cityList = await City.find({});
    const askedCity = await City.findOne({ cityName: city });
    if (!askedCity) {
      res.status(404).json({ response: "No such city found", success: false });
    }
    // see if the city is far enough (boolean)
    const isOvernight = qualifiesForOvernight(askedCity);
    if (isOvernight) {
      const nearByCities = getNearByCities(cityList, askedCity, 100);
      console.log("The near by cities are : ", nearByCities);
      let nearByShows = await Show.find({
        city: { $in: nearByCities },
      }).populate("city");

      // we filter only upcoming shows
      nearByShows = nearByShows.filter(
        (show) =>
          new Date(show.date).withoutTime().getTime() >
          new Date().withoutTime().getTime()
      );

      nearByShows.forEach((item, index) => {
        console.log(
          `There is nearby show in ${item.city.cityName} on this date `,
          item.date
        );
      });

      //we have to check if the previous or next date is not a weekend and return the possible dates
      console.log(
        "This is the NERBY SHOW varable before we pass it to the function ",
        nearByShows
      );

      let availableDatesAround = stripAwayWeekends(nearByShows);
      console.log(availableDatesAround);
      console.log(
        "These are availableDatesAround after striping away weekends ",
        availableDatesAround
      );

      //now we check if those possible dates are acctualy free
      availableDatesAround = await availableDatesAround.reduce(
        async (acc, date) => {
          console.log(`for this ${date} query is happening`);
          const show = await Show.findOne({ date });
          console.log("The result of the mongoDB: ", show);
          if (show === null) {
            return (await acc).concat(date);
          } else {
            return await acc;
          }
        },
        []
      );
      // const datesToSend = await availableDatesAround.forEach(async (item) => {
      //   const result = [];
      //   const show = await Show.findOne({ date });
      //   if (show === null) {
      //     if (!result.includes(item)) {
      //       result.push(item);
      //     }
      //   }
      // });

      console.log("Avalabledates after the reduce", availableDatesAround);
      // console.log("DateToSend after the forEach", datesToSend);
      // const booked = await Show.findOne({ date: availableDatesAround[0] });
      // console.log("Booked is ", booked);

      if ((await availableDatesAround.length) > 0) {
        // if the date client input is also a suggested/ optimized date we do not offer alternatives
        if (availableDatesAround.includes(date)) {
          res.status(200).json({ response: null, success: true });
        } else {
          res
            .status(200)
            .json({ response: availableDatesAround, success: true });
        }
      } else {
        res.status(200).json({ response: null, success: true });
      }
    } else {
      res.status(200).json({ response: null, success: true });
    }
  } catch (error) {
    res.status(401).json({ response: error, success: false });
  }
});

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});
