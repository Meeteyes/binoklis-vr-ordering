import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import { URL } from "../constants/URLS";
import ui from "../reducers/ui";
import Loader from "./Loader";

const Wrapper = styled.div`
  width: 80%;
  max-width: 700px;
  height: 50%;
  margin: 30px auto;
  padding: 20px 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  border-radius: 5px;
  background-color: #176bcc;
  color: white;
`;

const ConfirmBooking = () => {
  const store = useSelector((store) => store);
  // const [isLoading, setIsLoading] = useState(true);
  const [response, setResponse] = useState();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  console.log(store);
  // console.log("this is the isLoading prop", store.ui.isLoading);

  const options = {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    referrerPolicy: "no-referrer",
    body: JSON.stringify({
      city: store.order.city,
      address: store.order.address,
      date: store.order.date,
      contactPerson: store.order.contactPerson,
      phone: store.order.phone,
      email: store.order.email,
    }),
  };

  useEffect(() => {
    if (
      store.order.city &&
      store.order.date &&
      store.order.contactPerson &&
      store.order.email
    ) {
      fetch(URL("booking"), options)
        .then((res) => res.json())
        .then((json) => setResponse(json.response))
        .finally(() => dispatch(ui.actions.setLoading(false)));
    } else {
      navigate("/");
    }
  }, []);
  return (
    <>
      {store.ui.isLoading ? (
        <Loader />
      ) : (
        <Wrapper>
          <form>
            <h1>BOOKING CONFIRMATION:</h1>
            <p>City: {response.city.cityName}</p>
            <p>Date: {response.date}</p>
            <p>ContactPerson: {response.contactPerson}</p>
            <p>Email: {response.email}</p>
            <p>Phone: {response.phone}</p>
            <p>Address: {response.address}</p>
          </form>
        </Wrapper>
      )}
    </>
  );
};

export default ConfirmBooking;
