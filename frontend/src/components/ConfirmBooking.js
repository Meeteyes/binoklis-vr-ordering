import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import { URL } from "../constants/URLS";

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
  const store = useSelector((store) => store.order);
  const [isLoading, setIsLoading] = useState(true);
  const [response, setResponse] = useState();
  const navigate = useNavigate();

  const options = {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    referrerPolicy: "no-referrer",
    body: JSON.stringify({
      city: store.city,
      address: store.address,
      date: store.date,
      contactPerson: store.contactPerson,
      phone: store.phone,
      email: store.email,
    }),
  };

  useEffect(() => {
    if (store.city && store.date && store.contactPerson && store.email) {
      fetch(URL("booking"), options)
        .then((res) => res.json())
        .then((json) => setResponse(json.response))
        .finally(() => setIsLoading(false));
    } else {
      navigate("/");
    }
  }, []);
  return (
    <>
      {isLoading ? (
        <div>
          <p>LOADING</p>
        </div>
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
