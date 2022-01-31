import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchShows } from "../reducers/shows";

const AdminDesk = () => {
  const store = useSelector((store) => store);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchShows());
  }, [store.admin.accessToken]);

  return (
    <div>
      <h1>ADMIN DESK</h1>
      {store.shows.items.length > 0 &&
        store.shows.items.map((item) => (
          <p key={item.date}>"This is a bad mf date ", {item.date}</p>
        ))}
    </div>
  );
};

export default AdminDesk;
