import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import { TextField, Button } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import FormControl from "@mui/material/FormControl";

import { loginUser } from "../reducers/admin";
import Loader from "./Loader";

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  padding-top: 50px;
  background-color: #6ba987;
`;

const ContentContainer = styled.div`
  background-color: white;
  width: 600px;
  margin: 0px auto;
  padding: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  border-radius: 20px;
`;

const Span = styled.span`
  color: red;
  font-size: 30px;
  font-weight: 700;
`;

const Login = () => {
  const store = useSelector((store) => store);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  console.log(password);

  const handleButtonClick = () => {
    dispatch(loginUser(username, password));
    setTimeout(navigate("/adminDesk"), 2000);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    if (store.admin.accessToken) {
      navigate("/adminDesk");
    }
  }, [store.admin.accessToken]);

  return (
    <Wrapper>
      <ContentContainer>
        <Loader />
        <h1>
          <Span>Login</Span>
        </h1>
        <TextField
          sx={{
            width: "250px",
          }}
          id="username"
          label="Username"
          variant="outlined"
          onChange={(event) => setUsername(event.target.value)}
        />
        <FormControl variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">
            Password
          </InputLabel>
          <OutlinedInput
            sx={{
              width: "250px",
            }}
            id="outlined-adornment-password"
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  onMouseDown={handleMouseDownPassword}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
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
          disabled={username.length < 2 || password.length < 3}
        >
          Login
        </Button>
      </ContentContainer>
    </Wrapper>
  );
};

export default Login;
