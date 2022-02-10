import React, { useState, useEffect } from "react";
import { useDispatch, useSelector, batch } from "react-redux";
import { TextField, Button } from "@mui/material";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import order from "../reducers/order";
import Alternatives from "./Alternatives";
import ui from "../reducers/ui";

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  padding-top: 50px;
  padding-bottom: 20px;
  background-color: #6ba987;
`;

const ContentContainer = styled.div`
  background-color: white;
  width: 80%;
  margin: 0px auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  border-radius: 20px;
`;

const Booking = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState({ name: "", email: "", phone: "" });

  const dispatch = useDispatch();
  const store = useSelector((store) => store);
  const navigate = useNavigate();

  // validates the form and stores error messages in state obj or empty string if validation passes
  const validateForm = () => {
    let temp = {};
    temp.name = name.length > 2 ? "" : "Name is required";
    temp.email = emailIsValid(email) ? "" : "Invalid e-mail";
    temp.phone = phone.length === 8 ? "" : "Phone number must be 8 digits";
    setErrors({
      ...temp,
    });
    // we return boolean value depending if all properties are empty strings or not
    return Object.values(temp).every((x) => x === "");
  };

  // Check if the e-mail has the right format
  const emailIsValid = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // initiats the validation of the form and we write in Redux store in batch
  const handleButtonClick = async () => {
    if (validateForm()) {
      batch(() => {
        dispatch(order.actions.setContactPerson(name));
        dispatch(order.actions.setEmail(email));
        dispatch(order.actions.setAddress(address));
        dispatch(order.actions.setPhone(phone));
        dispatch(ui.actions.setLoading(true));
      });
      navigate("/confirmBooking");
    }
  };

  // if somehow this page is reached not in the planed flow it redirects to the beginning of the input form
  useEffect(() => {
    if (store.order.city === null || store.order.date === null) {
      navigate("/");
    }
  }, []);

  return (
    <Wrapper>
      <ContentContainer>
        <Alternatives />
        <h2> Please, fill out the form</h2>
        <TextField
          id="name"
          error={errors.name.length > 0}
          helperText={errors.name}
          label="Name"
          variant="outlined"
          sx={{
            width: "250px",
          }}
          onChange={(event) => setName(event.target.value)}
        />
        <TextField
          id="email"
          error={errors.email.length > 0}
          helperText={errors.email}
          label="E-mail"
          variant="outlined"
          sx={{
            width: "250px",
          }}
          onChange={(event) => setEmail(event.target.value)}
        />
        <TextField
          id="address"
          label="Address"
          variant="outlined"
          sx={{
            width: "250px",
          }}
          onChange={(event) => setAddress(event.target.value)}
        />
        <TextField
          id="phone"
          label="Phone"
          error={errors.phone.length > 0}
          helperText={errors.phone}
          variant="outlined"
          sx={{
            width: "250px",
          }}
          onChange={(event) => setPhone(event.target.value)}
        />
        <p>City: {store.order.city}</p>
        <p>Date: {store.order.date}</p>
        <Button
          sx={{
            width: "250px",
            backgroundColor: "#6ba987",
            ":hover": {
              backgroundColor: "red",
            },
          }}
          variant="contained"
          onClick={() => handleButtonClick()}
          disabled={email.length < 3 || name.length < 3}
        >
          Book
        </Button>
      </ContentContainer>
    </Wrapper>
  );
};

export default Booking;
