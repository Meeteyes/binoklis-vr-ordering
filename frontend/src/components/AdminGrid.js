import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import admin from "../reducers/admin";
import Popup from "./Popup";
import styled from "styled-components";

Date.prototype.withoutTime = function () {
  var d = new Date(this);
  d.setHours(12, 0, 0, 0);
  return d;
};
const Wrapper = styled.div`
  width: 100%;
  height: 70vh;
`;

const ButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 15px;
  justify-content: center;
  margin: 20px 0px;
`;

const AdminGrid = () => {
  const store = useSelector((store) => store);
  const dispatch = useDispatch();
  // This property will control what kind of data is displayed
  const [displayMode, setDisplayMode] = useState("all");

  // define the columns for the grid
  const columns = [
    { field: "id", headerName: "ID", width: 110 },
    {
      field: "date",
      headerName: "Date",
      width: 180,
      editable: true,
    },
    {
      field: "city",
      headerName: "City",
      width: 150,
      editable: true,
    },
    {
      field: "contactPerson",
      headerName: "ContactPerson",
      width: 120,
      editable: true,
    },
    {
      field: "phone",
      headerName: "Phone",
      description: "This column has a value getter and is not sortable.",
      width: 120,
    },
    {
      field: "email",
      headerName: "Email",
      description: "This column has a value getter and is not sortable.",
      width: 200,
    },
    {
      field: "isConfirmed",
      headerName: "Confirmed?",
      width: 110,
      editable: true,
    },
  ];

  // function that returns an object with provided values to match the DataGrid syntax requirements
  const createData = (
    id,
    date,
    city,
    contactPerson,
    phone,
    email,
    isConfirmed
  ) => {
    return { id, date, city, contactPerson, phone, email, isConfirmed };
  };

  // We create 4 different variables containing the row values to be displayed, only one of the is being displayed depending on the DisplayMode
  const rows = store.shows.items.map((show) =>
    createData(
      show._id,
      new Date(show.date).withoutTime(),
      show.city.cityName,
      show.contactPerson,
      show.phone,
      show.email,
      show.isConfirmed
    )
  );
  const upcomingRows = rows.filter(
    (row) => new Date(row.date) > new Date().withoutTime()
  );
  const pastRows = rows.filter(
    (row) => new Date(row.date) < new Date().withoutTime()
  );
  const unconfirmedRows = rows.filter((row) => row.isConfirmed === false);

  // This function handles the click on the row, updates Redux store with the id of the order and toggles the property which is responsible for mounting the popup with details
  const handleRow = (e) => {
    dispatch(
      admin.actions.setEditingOrder({
        id: e.row.id,
      })
    );
    dispatch(admin.actions.setDisplayDetails(true));
    dispatch(admin.actions.setIsLoading(false));
  };

  return (
    <Wrapper>
      <ButtonWrapper>
        <Button
          style={{ width: "80%", maxWidth: "250px" }}
          variant="contained"
          onClick={() => setDisplayMode("upcoming")}
          disabled={displayMode === "upcoming"}
        >
          Upcoming
        </Button>
        <Button
          style={{ width: "80%", maxWidth: "250px" }}
          variant="contained"
          onClick={() => setDisplayMode("past")}
          disabled={displayMode === "past"}
        >
          Past
        </Button>
        <Button
          style={{ width: "80%", maxWidth: "250px" }}
          variant="contained"
          onClick={() => setDisplayMode("unconfirmed")}
          disabled={displayMode === "unconfirmed"}
        >
          Unconfirmed
        </Button>
        <Button
          style={{ width: "80%", maxWidth: "250px" }}
          variant="contained"
          onClick={() => setDisplayMode("all")}
          disabled={displayMode === "all"}
        >
          All
        </Button>
      </ButtonWrapper>
      <DataGrid
        initialState={{
          sorting: {
            sortModel: [{ field: "date", sort: "asc" }],
          },
        }}
        rows={
          displayMode === "all"
            ? rows
            : displayMode === "upcoming"
            ? upcomingRows
            : displayMode === "past"
            ? pastRows
            : displayMode === "unconfirmed"
            ? unconfirmedRows
            : rows
        }
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        density="comfortable"
        disableSelectionOnClick
        editMode="row"
        sx={{
          width: "100%",
          height: "70vh", // maxWidth: "1200px",
        }}
        onRowClick={(e) => handleRow(e)}
      />
      {store.admin.displayDetails && <Popup />}
    </Wrapper>
  );
};

export default AdminGrid;
