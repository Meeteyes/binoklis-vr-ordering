import React, { useState, useEffect } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch } from "react-redux";
import order from "../reducers/order";
import moment from "moment";
import { URL } from "../constants/URLS";

// set the language for date picker
import dateFnsLv from "date-fns/locale/lv";
registerLocale("lv", dateFnsLv);

// This function strips away the time from Date Object
Date.prototype.withoutTime = function () {
  var d = new Date(this);
  d.setHours(10, 0, 0, 0);
  return d;
};

const SelectDate = () => {
  const dispatch = useDispatch();
  const [eventDate, setEventDate] = useState(new Date());
  const [bookedDates, setBookedDates] = useState([]);
  let weekends = [];
  let disabledDates = bookedDates.map((item) => item.date);

  const handleDateSelect = (date) => {
    setEventDate(date);
    dispatch(order.actions.setDate(moment(date).unix()));
  };

  // This function mreturns an array with weekends fro next 2 years
  const makeWeekends = () => {
    let result = [];
    const today = moment();
    const firstSaturday = moment(today).day(6);
    const firstSunday = moment(today).day(7);
    result = [
      new Date(firstSaturday).withoutTime().toDateString(),
      new Date(firstSunday).withoutTime().toDateString(),
    ];

    for (let i = 1; i < 104; i++) {
      const sat = moment().day(6 + i * 7);
      const sun = moment(firstSunday).day(0 + i * 7);
      result.push(
        new Date(sat).withoutTime().toDateString(),
        new Date(sun).withoutTime().toDateString()
      );
    }
    return result;
  };

  // we make the weekends and combine with the an array of dates that was received from API
  weekends = makeWeekends();
  disabledDates = [...disabledDates, ...weekends];
  console.log("Disabled dates", disabledDates);

  // In use effect we fetch from API booked dates
  useEffect(() => {
    fetch(URL("bookedDates"))
      .then((res) => res.json())
      .then((json) => setBookedDates(json.response));
  }, []);

  return (
    <DatePicker
      locale="lv"
      minDate={new Date()}
      selected={eventDate}
      onChange={(date) => handleDateSelect(date)}
      excludeDates={disabledDates.map((item) => new Date(item))}
      placeholderText="Select a date"
    />
  );
};

export default SelectDate;
