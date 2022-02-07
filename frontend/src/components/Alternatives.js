import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@mui/material";
import styled from "styled-components";
import moment from "moment";

import order from "../reducers/order";
import tag from "../img/tag2.png";
import { fetchAlternativeDates } from "../reducers/order";

const Wrapper = styled.div`
  width: 100%;
  max-width: 900px;
  height: 50%;
  margin: 0 auto;
  padding: 20px 30px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  border: 2px solid grey;
  border-radius: 5px;
`;
const Image = styled.img`
  width: 50px;
  margin: 0 0 0 auto;
`;

const Alternatives = () => {
  const store = useSelector((store) => store);
  const dispatch = useDispatch();

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
        <Wrapper>
          <h1>Use the discount!</h1>
          <h2> Consider a different date?</h2>
          <p>
            We already have a show planned near you. Would any of these dates
            work for you?
          </p>
          {store.order.altDates.map((item) => {
            return (
              <Button
                variant="outlined"
                key={item}
                onClick={() => dispatch(order.actions.setDate(item))}
              >
                {/* displaying the date on the button */}
                {moment(item).format("dddd")} {moment(item).format("MMM Do")}
              </Button>
            );
          })}
          <Image src={tag} alt="Discount" />
        </Wrapper>
      ) : (
        <>
          {" "}
          <h1>Great! Your chosen date is available.</h1>
        </>
      )}
    </>
  );
};

export default Alternatives;
