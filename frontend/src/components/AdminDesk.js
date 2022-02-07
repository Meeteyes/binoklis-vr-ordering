import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchShows } from "../reducers/shows";
// import OrdersAccordion from "./OrdersAccordion";
// import AdminTable from "./AdminTable";
import AdminGrid from "./AdminGrid";

const AdminDesk = () => {
  const store = useSelector((store) => store);
  let unconfirmed = [];
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchShows());
  }, [store.admin.accessToken]);

  if (store.shows.items.length > 0) {
    unconfirmed = store.shows.items.filter(
      (item) => item.isConfirmed === false
    );
  }
  console.log(unconfirmed);
  return (
    <div>
      <h1>ADMIN DESK</h1>
      {unconfirmed.length > 0 && (
        <div>
          You have <span>{unconfirmed.length}</span> unconfirmed orders!
        </div>
      )}
      {store.shows.items.length > 0 && <AdminGrid />}
    </div>
  );
};

export default AdminDesk;
