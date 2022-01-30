import React from "react";
import styled from "styled-components";
import { Button } from "@mui/material";
import student from "../img/student-icon.png";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

//Component imports
import SelectDate from "./SelectDate";
import InputForm from "./InputForm";

const Wrapper = styled.div`
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 20px 30px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Span = styled.span`
  color: red;
  font-size: 30px;
  font-weight: 700;
`;
const Image = styled.img`
  width: 70%;
`;
const Main = () => {
  const store = useSelector((store) => store);
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/booking");
  };
  return (
    <Wrapper>
      <div>
        <p>Order the Show</p>
        <h1>
          <Span>"</Span>Briefly about the universe!<Span>"</Span>
        </h1>
      </div>
      <InputForm />
      <SelectDate />
      <Button
        style={{ width: "80%", maxWidth: "250px" }}
        variant="contained"
        onClick={() => handleButtonClick()}
        disabled={store.order.city === null || store.order.date === null}
      >
        Check avalibility
      </Button>
      <Image src={student} alt="Kid with VR goggles" />
    </Wrapper>
  );
};

export default Main;
