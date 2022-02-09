import { createSlice } from "@reduxjs/toolkit";
import { URL } from "../constants/URLS";
import ui from "./ui";

const order = createSlice({
  name: "order",
  initialState: {
    city: null,
    date: null,
    contactPerson: null,
    address: null,
    email: null,
    phone: null,
    isLoading: false,
    altDates: [],
  },
  reducers: {
    setCity: (store, action) => {
      store.city = action.payload;
    },
    setDate: (store, action) => {
      store.date = action.payload;
    },
    setContactPerson: (store, action) => {
      store.contactPerson = action.payload;
    },
    setEmail: (store, action) => {
      store.email = action.payload;
    },
    setAddress: (store, action) => {
      store.address = action.payload;
    },
    setPhone: (store, action) => {
      store.phone = action.payload;
    },
    setIsLoading: (store, action) => {
      store.isLoading = action.payload;
    },
    setAltDates: (store, action) => {
      store.altDates = action.payload;
    },
  },
});

export const fetchAlternativeDates = () => {
  return (dispatch, getState) => {
    const store = getState();
    dispatch(ui.actions.setLoading(true));
    fetch(URL(`booking?city=${store.order.city}&date=${store.order.date}`))
      .then((res) => res.json())
      .then((json) => {
        dispatch(order.actions.setAltDates(json.response));
      })
      .finally(() => dispatch(ui.actions.setLoading(false)));
  };
};

export default order;
