import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { Button } from "@mui/material";

import student from "../img/student-icon.png";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

//Component imports
import SelectDate from "./SelectDate";
import SelectCity from "./SelectCity";
import Loader from "./Loader";

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  padding-top: 50px;
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
const Span = styled.span`
  color: red;
  font-size: 30px;
  font-weight: 700;
`;
const Image = styled.img`
  width: 100%;
  max-width: 450px;
`;
const Main = () => {
  const store = useSelector((store) => store);
  const navigate = useNavigate();
  const container = useRef(null);

  const handleButtonClick = () => {
    navigate("/booking");
  };

  return (
    <Wrapper>
      <ContentContainer>
        <Loader />
        <div>
          <p>Order the Show</p>
          <h1>
            <Span>"</Span>Briefly about the universe!<Span>"</Span>
          </h1>
        </div>
        <SelectCity />
        <SelectDate />
        <Button
          style={{ width: "80%", maxWidth: "250px" }}
          variant="contained"
          onClick={() => handleButtonClick()}
          disabled={store.order.city === null || store.order.date === null}
        >
          Check availability
        </Button>

        <Image src={student} alt="Kid with VR goggles" />
      </ContentContainer>
    </Wrapper>
  );
};

export default Main;
