import React from "react";
import InputForm from "./components/InputForm";
import SelectDate from "./components/SelectDate";
import cities from "./reducers/cities";
import order from "./reducers/order";
import { Provider } from "react-redux";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";

import Main from "./components/Main";

const reducer = combineReducers({
  cities: cities.reducer,
  order: order.reducer,
});

const store = configureStore({ reducer });
function App() {
  return (
    <Provider store={store}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Main />} />
          </Routes>
        </BrowserRouter>
      </LocalizationProvider>
    </Provider>
  );
}

export default App;
