import React from "react";
import { Provider } from "react-redux";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";

//Reducers
import cities from "./reducers/cities";
import order from "./reducers/order";

//Component imports
import Booking from "./components/Booking";
import Main from "./components/Main";
import ConfirmBooking from "./components/ConfirmBooking";

const reducer = combineReducers({
  cities: cities.reducer,
  order: order.reducer,
});

function App() {
  const store = configureStore({ reducer });
  return (
    <Provider store={store}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/confirmBooking" element={<ConfirmBooking />} />
          </Routes>
        </BrowserRouter>
      </LocalizationProvider>
    </Provider>
  );
}

export default App;
