import React, { useState } from "react";
import { useDispatch, useSelector, batch } from "react-redux";
import order from "../reducers/order";
import { TextField, Button } from "@mui/material";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Wrapper = styled.div`
  width: 70%;
  max-width: 500px;
  margin: 0 auto;
  padding: 20px 30px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Booking = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  console.log(phone);

  const [hasError, setHasError] = useState({
    name: false,
    email: false,
    address: false,
  });

  const dispatch = useDispatch();
  const store = useSelector((store) => store);
  const navigate = useNavigate();

  const emailIsValid = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  const handleEmail = (event) => {
    setIsValid(emailIsValid(email));
  };

  const handleButtonClick = () => {
    batch(() => {
      dispatch(order.actions.setContactPerson(name));
      dispatch(order.actions.setEmail(email));
      dispatch(order.actions.setAddress(address));
      dispatch(order.actions.setPhone(phone));
    });
    navigate("/confirmBooking");
  };

  return (
    <Wrapper>
      <h1> More details please!</h1>
      <TextField
        id="name"
        label="Name"
        variant="outlined"
        onChange={(event) => setName(event.target.value)}
        error={hasError.name}
      />
      <TextField
        id="email"
        label="E-mail"
        variant="outlined"
        onChange={(event) => setEmail(event.target.value)}
        // error={f}
      />
      <TextField
        id="address"
        label="Address"
        variant="outlined"
        onChange={(event) => setAddress(event.target.value)}
      />
      <TextField
        id="phone"
        label="Phone"
        variant="outlined"
        onChange={(event) => setPhone(event.target.value)}
      />
      <p>City: {store.order.city}</p>
      <p>Date: {store.order.date}</p>
      <Button
        style={{ width: "80%", maxWidth: "250px" }}
        variant="contained"
        onClick={() => handleButtonClick()}
        disabled={email.length < 3 || name.length < 3 || !emailIsValid(email)}
      >
        Book
      </Button>
    </Wrapper>
  );
};

export default Booking;
