import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import { URL } from "../constants/URLS";
import ui from "../reducers/ui";
import Loader from "./Loader";
import Space from "../img/space.png";

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
const SpaceIcon = styled.img`
  width: 150px;
`;
const Span = styled.span`
  color: red;
  display: block;
  text-align: center;
`;
const SpanBold = styled.span`
  font-weight: 700;
  color: green;
`;
const OrderCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-left: 20px;
`;

const ConfirmBooking = () => {
  const store = useSelector((store) => store);
  const [response, setResponse] = useState();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const options = {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    referrerPolicy: "no-referrer",
    body: JSON.stringify({
      city: store.order.city,
      address: store.order.address,
      date: store.order.date,
      contactPerson: store.order.contactPerson,
      phone: store.order.phone,
      email: store.order.email,
    }),
  };

  useEffect(() => {
    if (
      store.order.city &&
      store.order.date &&
      store.order.contactPerson &&
      store.order.email
    ) {
      fetch(URL("booking"), options)
        .then((res) => res.json())
        .then((json) => setResponse(json.response))
        .finally(() => dispatch(ui.actions.setLoading(false)));
    } else {
      navigate("/");
    }
  }, []);
  return (
    <>
      {store.ui.isLoading ? (
        <Loader />
      ) : (
        <Wrapper>
          <ContentContainer>
            <h1>
              <Span>Perfect!</Span>
            </h1>
            <h3>VR Show is coming your way:</h3>
            <OrderCard>
              <p>
                City: <SpanBold>{response.city.cityName}</SpanBold>
              </p>
              <p>
                Date: <SpanBold>{response.date}</SpanBold>
              </p>
              <p>
                ContactPerson: <SpanBold>{response.contactPerson}</SpanBold>
              </p>
              <p>
                Email: <SpanBold>{response.email}</SpanBold>
              </p>
              <p>
                Phone: <SpanBold>{response.phone}</SpanBold>
              </p>
              <p>
                Address: <SpanBold>{response.address}</SpanBold>
              </p>
            </OrderCard>
            <SpaceIcon src={Space} al="planets in galaxy" />
          </ContentContainer>
        </Wrapper>
      )}
    </>
  );
};

export default ConfirmBooking;
