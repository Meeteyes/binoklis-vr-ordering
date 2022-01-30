import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import TextField from "@mui/material/TextField";
import DatePicker from "@mui/lab/DatePicker";
import moment from "moment";
import styled from "styled-components";

import order from "../reducers/order";
import { URL } from "../constants/URLS";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

// This function strips away the time from Date Object
Date.prototype.withoutTime = function () {
  var d = new Date(this);
  d.setHours(10, 0, 0, 0);
  return d;
};

const SelectContainer = styled.form`
  width: 80%;
  max-width: 500px;
`;

const SelectDate = () => {
  // variables
  const dispatch = useDispatch();
  const today = new Date();
  const [eventDate, setEventDate] = useState();
  const [bookedDates, setBookedDates] = useState([]);
  let weekends = [];
  let disabledDates = bookedDates.map((item) => item.date);

  // functions
  const handleDateSelect = (date) => {
    setEventDate(date);
    dispatch(order.actions.setDate(date.withoutTime().toDateString()));
  };

  // returns an array of weekend dates for the next two years
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

  // function that is being run by each date in the DatePicker, if true => disable the date
  const disableDays = (date) => {
    if (disabledDates.includes(date.toDateString() || date < new Date())) {
      return true;
    } else {
      return false;
    }
  };

  // In use effect we fetch from API booked dates
  useEffect(() => {
    fetch(URL("bookedDates"))
      .then((res) => res.json())
      .then((json) => setBookedDates(json.response));
  }, []);

  return (
    <SelectContainer>
      <DatePicker
        minDate={today}
        label="Datums"
        value={eventDate}
        onChange={(newValue) => handleDateSelect(newValue)}
        shouldDisableDate={disableDays}
        renderInput={(params) => <TextField {...params} />}
      />
    </SelectContainer>
  );
};

export default SelectDate;
