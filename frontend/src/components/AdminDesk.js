import { Button } from "@mui/material";

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchShows } from "../reducers/shows";
import admin from "../reducers/admin";
import AdminGrid from "./AdminGrid";

const AdminDesk = () => {
  const store = useSelector((store) => store);
  let unconfirmed = [];
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = () => {
    dispatch(admin.actions.setAccessToken(null));
  };

  useEffect(() => {
    if (store.admin.accessToken) {
      dispatch(fetchShows());
    } else {
      navigate("/login");
    }
  }, [store.admin.accessToken]);

  if (store.shows.items.length > 0) {
    unconfirmed = store.shows.items.filter(
      (item) => item.isConfirmed === false
    );
  }
  return (
    <>
      {store.admin.accessToken ? (
        <div>
          <h1>ADMIN DESK</h1>
          <Button variant="outlined" onClick={logout}>
            Logout
          </Button>
          {unconfirmed.length > 0 && (
            <div>
              You have <span>{unconfirmed.length}</span> unconfirmed orders!
            </div>
          )}
          {store.shows.items.length > 0 && <AdminGrid />}
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default AdminDesk;
