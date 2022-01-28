import React, { useEffect, useState } from "react";
import Select from "react-select";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { fetchCities } from "../reducers/cities";
import order from "../reducers/order";
import { createSelectOptions } from "../constants/functions";

const SelectContainer = styled.form`
  width: 80%;
  max-width: 500px;
`;

const InputForm = () => {
  // ----- variables -----
  const dispatch = useDispatch();
  const store = useSelector((store) => store);

  // we create an array with a slice of store that is shown inside the Select
  const options = createSelectOptions(store.cities.list);

  const handleChange = (event) => {
    dispatch(order.actions.setCity(event.value));
  };
  // we call thunk in redux store to fetch from API
  useEffect(() => {
    dispatch(fetchCities());
  }, [dispatch]);

  // Rendering the element
  return (
    <SelectContainer>
      <Select
        width="200px"
        options={options}
        onChange={(event) => handleChange(event)}
      />
    </SelectContainer>
  );
};

export default InputForm;
