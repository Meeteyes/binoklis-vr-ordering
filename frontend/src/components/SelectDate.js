import React, { useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch } from "react-redux";
import order from "../reducers/order";
import moment from "moment";

// set the language for date picker
import dateFnsLv from "date-fns/locale/lv";
registerLocale("lv", dateFnsLv);

const SelectDate = () => {
  const dispatch = useDispatch();
  const [eventDate, setEventDate] = useState(new Date());
  console.log(eventDate);

  const handleDateSelect = (date) => {
    setEventDate(date);
    dispatch(order.actions.setDate(moment(date).unix()));
  };

  return (
    <DatePicker
      locale="lv"
      minDate={new Date()}
      selected={eventDate}
      onChange={(date) => handleDateSelect(date)}
      excludeDates={[new Date(2022, 0, 24), new Date(2022, 0, 27)]}
      placeholderText="Select a date"
    />
  );
};

export default SelectDate;
