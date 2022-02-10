import { Button } from "@mui/material";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchShows } from "../reducers/shows";
import admin from "../reducers/admin";
import AdminGrid from "./AdminGrid";
import styled from "styled-components";
import Logo from "../img/binoklis.png";

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  padding: 50px 100px 10px 100px;
`;
const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const Red = styled.span`
  color: red;
`;

const LogoImg = styled.img`
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 20%;
`;

const AdminDesk = () => {
  const store = useSelector((store) => store);
  let unconfirmed = [];
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = () => {
    dispatch(admin.actions.setAccessToken(null));
  };

  useEffect(() => {
    if (store.admin.accessToken) {
      dispatch(fetchShows());
    } else {
      navigate("/login");
    }
  }, [store.admin.accessToken]);

  // stores all the unconfirmed shows in a local array
  if (store.shows.items.length > 0) {
    unconfirmed = store.shows.items.filter(
      (item) => item.isConfirmed === false
    );
  }
  return (
    <>
      {store.admin.accessToken ? (
        <Wrapper>
          <Header>
            <LogoImg src={Logo} alt="Company Binoklis Logo" />
            <h1>ADMIN DESK</h1>
            {unconfirmed.length > 0 && (
              <div>
                You have <Red>{unconfirmed.length}</Red> unconfirmed orders!
              </div>
            )}
            <Button variant="outlined" onClick={logout}>
              Logout
            </Button>
          </Header>
          {store.shows.items.length > 0 && <AdminGrid />}
        </Wrapper>
      ) : (
        <></>
      )}
    </>
  );
};

export default AdminDesk;
