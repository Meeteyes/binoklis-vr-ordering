import React, { useEffect } from "react";
import Select from "react-select";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { fetchCities } from "../reducers/cities";
import order from "../reducers/order";
import { createSelectOptions } from "../constants/functions";

const SelectContainer = styled.form`
  width: 200px;
`;

const InputForm = () => {
  // ----- variables -----
  const dispatch = useDispatch();
  const store = useSelector((store) => store);

  // we create an array with a slice of store that is shown inside the Select
  const options = createSelectOptions(store.cities.list);

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
        onChange={(event) => dispatch(order.actions.setCity(event.value))}
      />
    </SelectContainer>
  );
};

export default InputForm;
