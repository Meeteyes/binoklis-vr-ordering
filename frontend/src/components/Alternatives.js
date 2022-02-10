import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Alert, AlertTitle } from "@mui/material";
import styled from "styled-components";
import moment from "moment";

import order from "../reducers/order";
import tag from "../img/tag2.png";
import { fetchAlternativeDates } from "../reducers/order";

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
const TextGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Image = styled.img`
  width: 50px;
  margin: 0 0 0 auto;
`;
const Line = styled.div`
  width: 250px;
  height: 1px;
  background-color: #6ba987;
  border-radius: 1px;
`;

const Alternatives = () => {
  const store = useSelector((store) => store);
  const dispatch = useDispatch();
  const [alert, setAlert] = useState(false);

  // on Mount we fetch for alternative Date, a function written in redux thunk and reading state property so no props needed
  useEffect(() => {
    if (store.order.city && store.order.date) {
      dispatch(fetchAlternativeDates());
    }
  }, [dispatch]);

  // we either offer alternatives or confirm that the date is free
  return (
    <>
      {store.order.altDates.length > 0 ? (
        <ContentContainer>
          <TextGroup>
            <h2> Would you like a discount?</h2>
            <p>Maybe one of these dates work for you?</p>
            <p>This would help us to optimize the route and burn less fuel.</p>
          </TextGroup>
          {store.order.altDates.map((item) => {
            return (
              <Button
                variant="outlined"
                key={item}
                onClick={() => {
                  setAlert(true);
                  dispatch(order.actions.setDate(item));
                }}
                sx={{
                  width: "250px",
                  border: "solid 1px #6ba987",
                  color: "#FF144F",
                }}
              >
                {/* displaying the date on the button */}
                {moment(item).format("dddd")} {moment(item).format("MMM Do")}
              </Button>
            );
          })}
          <Image src={tag} alt="Discount" />
          <Line />
          {alert && (
            <Alert severity="success">
              <AlertTitle>The date is changed</AlertTitle>
            </Alert>
          )}
        </ContentContainer>
      ) : (
        <ContentContainer>
          <h1>Great! Your chosen date is available.</h1>
        </ContentContainer>
      )}
    </>
  );
};

export default Alternatives;
