import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import styled from "styled-components";
import { useSelector } from "react-redux";

const LoaderWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  right: 0px;
  left: 0px;
  top: 0px;
  bottom: 0px;
  background-color: white;
  z-index: 5;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Loader = () => {
  const store = useSelector((store) => store.ui);
  return (
    <>
      {store.isLoading && (
        <LoaderWrapper>
          <CircularProgress />
        </LoaderWrapper>
      )}
    </>
  );
};

export default Loader;
