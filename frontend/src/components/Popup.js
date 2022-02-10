import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import {
  TextField,
  FormGroup,
  FormControlLabel,
  Switch,
  Alert,
  AlertTitle,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import admin from "../reducers/admin";
import shows, { fetchShows } from "../reducers/shows";
import { URL } from "../constants/URLS";
import DeleteIcon from "@mui/icons-material/Delete";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    width: "90%",
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;
  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

const Popup = () => {
  const [open, setOpen] = useState(true);
  const store = useSelector((store) => store);
  const showToChange = store.shows.items.find(
    (item) => item._id === store.admin.editingOrder.id
  );

  // making local state variables to change and send it to server fpr updating the show entry
  const [contactPerson, setContactPerson] = useState(
    showToChange.contactPerson
  );
  const [phone, setPhone] = useState(showToChange.phone);
  const [email, setEmail] = useState(showToChange.email);
  const [address, setAddress] = useState(showToChange.address);
  const [isConfirmed, setIsConfirmed] = useState(showToChange.isConfirmed);
  const [confirmDelete, setConfirmDelete] = useState(false);

  //to show the error or success
  const [afterPatchMessage, setAfterPatchMessage] = useState();

  const dispatch = useDispatch();

  // const handleClickOpen = () => {
  //   setOpen(!open);
  // };
  const handleClose = () => {
    setOpen(false);
    dispatch(admin.actions.setDisplayDetails());
  };
  const closeMenu = () => {
    setOpen(false);
  };

  const handleSave = () => {
    const options = {
      method: "PATCH",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        Authorization: store.admin.accessToken,
      },
      referrerPolicy: "no-referrer",
      body: JSON.stringify({
        id: store.admin.editingOrder.id,
        address,
        contactPerson,
        phone,
        email,
        isConfirmed,
      }),
    };
    fetch(URL("updateShow"), options)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          console.log("This is response", json);
          setAfterPatchMessage("success");
          dispatch(shows.actions.setSingleShow(json.response));
        } else {
          setAfterPatchMessage("error");
        }
      });
  };

  const deleteFromServer = () => {
    const options = {
      method: "DELETE",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        Authorization: store.admin.accessToken,
      },
      referrerPolicy: "no-referrer",
    };

    fetch(URL(`updateShow?id=${showToChange._id}`), options)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setOpen(false);
          dispatch(admin.actions.setDisplayDetails(false));
          dispatch(fetchShows());
        }
      });
  };

  const giveDeleteOption = () => {
    setConfirmDelete(true);
  };
  const handleDeleteConfirmation = (choice) => {
    if (!choice) {
      setConfirmDelete(false);
    } else {
      deleteFromServer();
      setOpen(false);
    }
  };

  return (
    <div>
      {store.admin.isLoading === false && (
        <BootstrapDialog
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={open}
          sx={{
            width: "100%",
          }}
        >
          <BootstrapDialogTitle
            id="customized-dialog-title"
            onClose={handleClose}
            sx={{
              width: "600px",
            }}
          >
            {store.admin.editingOrder.id}
          </BootstrapDialogTitle>
          <DialogContent dividers>
            <Typography
              sx={{
                paddingLeft: "50px",
              }}
              component={"div"}
              gutterBottom
            >
              City: {showToChange.city.cityName}
            </Typography>
            <Typography
              component={"div"}
              sx={{
                paddingLeft: "50px",
              }}
              gutterBottom
            >
              Date: {showToChange.date}
            </Typography>
            <Typography
              component={"div"}
              sx={{
                paddingLeft: "50px",
              }}
              gutterBottom
            >
              <TextField
                id="name"
                sx={{
                  width: "300px",
                }}
                label="Contact Person"
                variant="outlined"
                defaultValue={contactPerson}
                onChange={(event) => setContactPerson(event.target.value)}
              />
            </Typography>
            <Typography
              component={"div"}
              sx={{
                paddingLeft: "50px",
              }}
              gutterBottom
            >
              <TextField
                id="email"
                sx={{
                  width: "300px",
                }}
                label="E-mail"
                variant="outlined"
                defaultValue={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </Typography>
            <Typography
              component={"div"}
              sx={{
                paddingLeft: "50px",
              }}
              gutterBottom
            >
              <TextField
                id="phone"
                sx={{
                  width: "300px",
                }}
                label="Phone"
                variant="outlined"
                defaultValue={phone}
                onChange={(event) => setPhone(event.target.value)}
              />
            </Typography>
            <Typography
              component={"div"}
              sx={{
                paddingLeft: "50px",
              }}
              gutterBottom
            >
              <TextField
                sx={{
                  width: "300px",
                }}
                id="address"
                label="Address"
                variant="outlined"
                defaultValue={address}
                onChange={(event) => setAddress(event.target.value)}
              />
            </Typography>
            <Typography component={"div"} gutterBottom>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      color="secondary"
                      checked={isConfirmed}
                      onChange={() => setIsConfirmed(!isConfirmed)}
                      inputProps={{ "aria-label": "controlled" }}
                    />
                  }
                  label="Confirmed?"
                />
                {!confirmDelete && (
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={giveDeleteOption}
                    startIcon={<DeleteIcon />}
                  >
                    Delete
                  </Button>
                )}
              </FormGroup>
            </Typography>
            <Typography component={"div"} gutterBottom>
              {confirmDelete && (
                <Alert severity="warning">
                  <p>Are you sure you want to delete this order?</p>
                  <Button
                    variant="outlined"
                    onClick={() => handleDeleteConfirmation(false)}
                  >
                    No!
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDeleteConfirmation(true)}
                  >
                    Yes, delete!
                  </Button>
                </Alert>
              )}
              {afterPatchMessage && (
                <Alert severity={afterPatchMessage}>
                  <AlertTitle>{afterPatchMessage}</AlertTitle>
                  The request was a <strong>{afterPatchMessage}</strong>
                </Alert>
              )}
            </Typography>
          </DialogContent>
          <DialogActions>
            {afterPatchMessage ? (
              <Button autoFocus onClick={closeMenu}>
                Close Menu
              </Button>
            ) : (
              <Button autoFocus onClick={handleSave}>
                Save changes
              </Button>
            )}
          </DialogActions>
        </BootstrapDialog>
      )}
    </div>
  );
};

export default Popup;
