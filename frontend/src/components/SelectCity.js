import React, { useEffect, useState } from "react";
import Select from "react-select";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import order from "../reducers/order";
import { fetchCities } from "../reducers/cities";
import { createSelectOptions } from "../constants/functions";

const SelectContainer = styled.form`
  width: 250px;
`;

const SelectCity = () => {
  // ----- variables -----
  const dispatch = useDispatch();
  const store = useSelector((store) => store);

  // we create an array of cities that will be shown in Selector
  const options = createSelectOptions(store.cities.list);

  const handleChange = (event) => {
    dispatch(order.actions.setCity(event.value));
  };
  // we call thunk in redux store to fetch from API
  useEffect(() => {
    dispatch(fetchCities());
  }, [dispatch]);

  return (
    <SelectContainer>
      <Select
        width="200px"
        options={options}
        onChange={(event) => handleChange(event)}
        placeholder="City"
      />
    </SelectContainer>
  );
};

export default SelectCity;
