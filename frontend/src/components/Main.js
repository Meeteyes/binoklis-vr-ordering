import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { Button, requirePropFactory, svgIconClasses } from "@mui/material";

import student from "../img/student-icon.png";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import lottie from "lottie-web";
import planet from "../img/planet.json";

//Component imports
import SelectDate from "./SelectDate";
import SelectCity from "./SelectCity";
import Loader from "./Loader";

const Wrapper = styled.div`
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 20px 30px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
`;
const Animation = styled.div`
  width: 150px;
  margin: 0 auto;
  position: absolute;
  top: 0;
  right: 0;
  z-index: -5;
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
  const container = useRef(null);

  const handleButtonClick = () => {
    navigate("/booking");
  };

  useEffect(() => {
    lottie.loadAnimation({
      container: container.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: require("../img/planet.json"),
    });
  }, []);
  return (
    <Wrapper>
      {/* <Animation className="container" ref={container}></Animation> */}
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
        Check avalibility
      </Button>

      <Image src={student} alt="Kid with VR goggles" />
    </Wrapper>
  );
};

export default Main;
