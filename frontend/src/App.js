import React from "react";
import InputForm from "./components/InputForm";
import SelectDate from "./components/SelectDate";
import cities from "./reducers/cities";
import order from "./reducers/order";
import { Provider } from "react-redux";
import { configureStore, combineReducers } from "@reduxjs/toolkit";

const reducer = combineReducers({
  cities: cities.reducer,
  order: order.reducer,
});

const store = configureStore({ reducer });
function App() {
  return (
    <Provider store={store}>
      <InputForm />
      <SelectDate />
    </Provider>
  );
}

export default App;
