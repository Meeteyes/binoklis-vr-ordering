import { createSlice } from "@reduxjs/toolkit";

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
    dispatch(cities.actions.setLoading(true));
    fetch("http://localhost:8080/cities")
      .then((res) => res.json())
      .then((json) => {
        dispatch(cities.actions.setList(json.response));
        dispatch(cities.actions.setLoading(false));
      });
  };
};

export default cities;
