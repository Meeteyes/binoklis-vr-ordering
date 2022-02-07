import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useSelector } from "react-redux";

const AdminTable = () => {
  const store = useSelector((store) => store);

  const createData = (date, city, contactPerson, phone, email, confirmed) => {
    return { date, city, contactPerson, phone, email, confirmed };
  };
  const rows = store.shows.items.map((show) =>
    createData(
      show.date,
      show.city.cityName,
      show.contactPerson,
      show.phone,
      show.email,
      "not yet"
    )
  );

  console.log(rows);
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell align="right">City</TableCell>
            <TableCell align="right">Contact Person(g)</TableCell>
            <TableCell align="right">Phone</TableCell>
            <TableCell align="right">E-mail</TableCell>
            <TableCell align="right">Confirmed?</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.date + row.city}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.date}
              </TableCell>
              <TableCell align="right">{row.city}</TableCell>
              <TableCell align="right">{row.contactPerson}</TableCell>
              <TableCell align="right">{row.phone}</TableCell>
              <TableCell align="right">{row.email}</TableCell>
              <TableCell align="right">{row.confirmed}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AdminTable;
