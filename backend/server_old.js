import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import crypto from "crypto";
import bcrypt from "bcrypt-nodejs";

///---- MONGO DB ---
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/binoklis";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// ---- Schema for the Show ------
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
    required: "Email address is required",
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },
  isConfirmed: {
    type: Boolean,
    default: false,
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

/// ---- Admin Schema -----
const AdminSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    minLenght: 5,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  accessToken: {
    type: String,
    default: () => crypto.randomBytes(128).toString("hex"),
  },
});

const Show = new mongoose.model("Show", ShowSchema);
const City = new mongoose.model("City", CitySchema);
const Admin = new mongoose.model("Admin", AdminSchema);

Date.prototype.withoutTime = function () {
  var d = new Date(this);
  d.setHours(10, 0, 0, 0);
  return d;
};

// function that compares the distances between the show City and rest of the cities, and returns array with cities in specified radius
const getNearByCities = (cityList, showCity, radius) => {
  let result = cityList.filter((item) => {
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
  const result = [];
  array.forEach((show) => {
    let previousDay = new Date(show.date).withoutTime();
    previousDay.setDate(previousDay.getDate() - 1);
    previousDay = previousDay.withoutTime().toDateString();

    let nextDay = new Date(show.date).withoutTime();
    nextDay.setDate(nextDay.getDate() + 1);
    nextDay = nextDay.withoutTime().toDateString();

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
  return result;
};

//---- AUTHENTICATION
const authenticateUser = async (req, res, next) => {
  const accessToken = req.header("Authorization");
  console.log("accessToken received: ", accessToken);
  try {
    const loggedAdmin = await Admin.findOne({ accessToken });
    console.log("LoogedAdmin", loggedAdmin);
    if (loggedAdmin) {
      next();
    } else {
      res.status(401).json({
        response: {
          message: "Please, log in",
        },
        success: false,
      });
    }
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
};

const port = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(express.json());

app.get("/admin", authenticateUser);
app.get("/admin", async (req, res) => {
  console.log("Getting to authenticated page");
  try {
    const shows = await Show.find({}).populate("city");
    console.log("SHOWS----SHOWS  : ", shows);
    if (shows) {
      res.status(200).json({ response: shows, success: true });
    } else {
      res.status(200).json({ response: "No shows found", success: true });
    }
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
});
app.patch("/updateShow", authenticateUser);
app.patch("/updateShow", async (req, res) => {
  const { id, contactPerson, email, phone, address, isConfirmed } = req.body;
  try {
    const show = await Show.findOneAndUpdate(
      { _id: id },
      { contactPerson, email, phone, address, isConfirmed },
      { new: true }
    ).populate("city");
    if (show) {
      res.status(200).json({ response: show, success: true });
    } else {
      res
        .status(200)
        .json({ response: "Event with such id not found", success: false });
    }
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
});

app.post("/signup", async (req, res) => {
  const { username, password, email } = req.body;
  console.log(username, password, email);
  const salt = bcrypt.genSaltSync();
  try {
    const newAdmin = await new Admin({
      username,
      password: bcrypt.hashSync(password, salt),
      email,
    }).save();
    res.status(201).json({ response: newAdmin, success: true });
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const loggedUser = await Admin.findOne({ username });
    if (loggedUser && bcrypt.compareSync(password, loggedUser.password)) {
      res.status(200).json({
        response: {
          username: loggedUser.username,
          userId: loggedUser._id,
          accessToken: loggedUser.accessToken,
        },
        success: true,
      });
    } else {
      res
        .status(401)
        .json({ response: "User or password not found", success: false });
    }
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
});

// path that provides all the cities of Latvia that are in DB
app.get("/cities", async (req, res) => {
  try {
    const cityList = await City.find({}, { cityName: 1 });
    res.status(200).json({ response: cityList, success: true });
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
});

// This path returns an array with dates that are already booked
app.get("/bookedDates", async (req, res) => {
  try {
    const bookedDates = await Show.find({}, { date: 1, city: 1 }).populate(
      "city"
    );
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
    res.status(400).json({ response: error, success: false });
  }
});

// this path returns alternative dates for the show. Should be used before booking of the show to optimize the logistics
app.get("/booking", async (req, res) => {
  const { city, date } = req.query;

  try {
    // we get the city List and the chosen city
    const cityList = await City.find({});
    const askedCity = await City.findOne({ cityName: city });
    if (!askedCity) {
      res.status(404).json({ response: "No such city found", success: false });
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
});

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});
