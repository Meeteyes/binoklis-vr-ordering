import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { URL } from "../constants/URLS";
import styled from "styled-components";

const Wrapper = styled.div`
  background-color: lightblue;
  width: 100%;
  max-width: 900px;
  margin: 15 auto;
  padding: 20px 30px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ConfirmBooking = () => {
  const store = useSelector((store) => store.order);
  const [isLoading, setIsLoading] = useState(true);
  const [response, setResponse] = useState();

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
    fetch(URL("booking"), options)
      .then((res) => res.json())
      .then((json) => setResponse(json.response))
      .finally(() => setIsLoading(false));
  }, []);
  return (
    <>
      {isLoading ? (
        <div>
          <p>LOADING</p>
        </div>
      ) : (
        <Wrapper>
          <h1>BOOKING CONFIRMATION:</h1>
          <p>City: {response.city.cityName}</p>
          <p>Date: {response.date}</p>
          <p>ContactPerson: {response.contactPerson}</p>
          <p>Email: {response.email}</p>
          <p>Phone: {response.phone}</p>
          <p>Address: {response.address}</p>
        </Wrapper>
      )}
    </>
  );
};

export default ConfirmBooking;
