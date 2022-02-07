import { createSlice } from "@reduxjs/toolkit";
import { URL } from "../constants/URLS";

const shows = createSlice({
  name: "shows",
  initialState: {
    items: [],
    isLoading: false,
  },
  reducers: {
    setItems: (store, action) => {
      store.items = action.payload;
    },
    setIsLoading: (store, action) => {
      store.isLoading = action.payload;
    },
    setSingleShow: (store, action) => {
      const index = store.items.findIndex(
        (item) => item._id === action.payload._id
      );
      store.items[index] = action.payload;
    },
  },
});

export const fetchShows = () => {
  return (dispatch, getState) => {
    const store = getState();
    const options = {
      method: "GET",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        Authorization: store.admin.accessToken,
      },
      referrerPolicy: "no-referrer",
    };
    dispatch(shows.actions.setIsLoading(true));
    fetch(URL(`admin`), options)
      .then((res) => res.json())
      .then((json) => {
        dispatch(shows.actions.setItems(json.response));
        dispatch(shows.actions.setIsLoading(false));
      });
  };
};

export default shows;
