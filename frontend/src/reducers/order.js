import { createSlice } from "@reduxjs/toolkit";

const order = createSlice({
  name: "order",
  initialState: {
    city: null,
    date: null,
    contactPerson: null,
    email: null,
    phone: null,
    isLoading: false,
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
    setPhone: (store, action) => {
      store.phone = action.payload;
    },
    setIsLoading: (store, action) => {
      store.isLoading = action.payload;
    },
  },
});

export default order;
