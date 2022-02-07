import { createSlice } from "@reduxjs/toolkit";
import { batch } from "react-redux";
import { URL } from "../constants/URLS";

const admin = createSlice({
  name: "admin",
  initialState: {
    username: null,
    accessToken: null,
    userId: null,
    isLoading: false,
    editingOrder: { id: null, item: [] },
    displayDetails: false,
  },
  reducers: {
    setUsername: (store, action) => {
      store.username = action.payload;
    },
    setAccessToken: (store, action) => {
      store.accessToken = action.payload;
    },
    setUserId: (store, action) => {
      store.userId = action.payload;
    },
    setIsLoading: (store, action) => {
      store.isLoading = action.payload;
    },
    setEditingOrder: (store, action) => {
      store.editingOrder = action.payload;
    },
    setDisplayDetails: (store, action) => {
      store.displayDetails = !store.displayDetails;
    },
  },
});

export const loginUser = (username, password) => {
  const options = {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    referrerPolicy: "no-referrer",
    body: JSON.stringify({
      username,
      password,
    }),
  };
  return (dispatch) => {
    dispatch(admin.actions.setIsLoading(true));
    fetch(URL("login"), options)
      .then((res) => res.json())
      .then((json) => {
        batch(() => {
          dispatch(admin.actions.setUsername(json.response.username));
          dispatch(admin.actions.setUserId(json.response.userId));
          dispatch(admin.actions.setAccessToken(json.response.accessToken));
        });
      })
      .finally(() => dispatch(admin.actions.setIsLoading(false)));
  };
};

export const fetchSingleShow = () => {
  return (dispatch, getState) => {
    dispatch(admin.actions.setIsLoading(true));
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

    dispatch(admin.actions.setIsLoading(true));
    fetch(URL(`singleShow?id=${store.admin.editingOrder.id}`), options)
      .then((res) => res.json())
      .then((json) => {
        dispatch(admin.actions.setEditingOrder({ item: json }));
      });
  };
  dispatch(admin.actions.setIsLoading(false));
};

export default admin;
