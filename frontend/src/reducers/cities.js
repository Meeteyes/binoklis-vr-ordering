import { createSlice } from "@reduxjs/toolkit";
import ui from "./ui";

const cities = createSlice({
  name: "cities",
  initialState: {
    list: [],
    isLoading: false,
  },
  reducers: {
    setList: (store, action) => {
      store.list = action.payload;
    },
    setLoading: (store, action) => {
      store.isLoading = action.payload;
    },
  },
});

export const fetchCities = () => {
  return (dispatch) => {
    dispatch(ui.actions.setLoading(true));
    fetch("http://localhost:8080/cities")
      .then((res) => res.json())
      .then((json) => {
        dispatch(cities.actions.setList(json.response));
      })
      .finally(() => dispatch(ui.actions.setLoading(false)));
  };
};

export default cities;
