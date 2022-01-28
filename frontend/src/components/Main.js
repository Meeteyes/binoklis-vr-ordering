import React from "react";
import SelectDate from "./SelectDate";
import InputForm from "./InputForm";
import styled from "styled-components";

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
const Main = () => {
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
    </Wrapper>
  );
};

export default Main;
