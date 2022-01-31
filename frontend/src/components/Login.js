import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { TextField, Button } from "@mui/material";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import admin, { loginUser } from "../reducers/admin";

const Wrapper = styled.div`
  width: 70%;
  max-width: 500px;
  margin: 0 auto;
  padding: 20px 30px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleButtonClick = () => {
    dispatch(loginUser(username, password));
    navigate("/adminDesk");
  };

  return (
    <Wrapper>
      <h1>PLEASE LOGIN</h1>
      <TextField
        id="username"
        label="Username"
        variant="outlined"
        onChange={(event) => setUsername(event.target.value)}
      />
      <TextField
        id="password"
        label="Password"
        variant="outlined"
        onChange={(event) => setPassword(event.target.value)}
      />
      <Button
        style={{ width: "80%", maxWidth: "250px" }}
        variant="contained"
        onClick={() => handleButtonClick()}
        disabled={username.length < 2 || password.length < 3}
      >
        Book
      </Button>
    </Wrapper>
  );
};

export default Login;
