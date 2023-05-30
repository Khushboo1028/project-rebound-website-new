import React, { useEffect, useState } from "react";
import { Colors } from "../../../../constants/Colors";
import { Box, Grid, TextField, Icon } from "@mui/material";
import { inputStyle } from "../styles";
import { useAuth } from "../../../../firebase/AuthContext";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Timestamp, doc } from "firebase/firestore";
import { db } from "../../../../firebase/firebase";
import { updateData } from "../../../../firebase/firebaseReadWrite";

const PersonalDetailsForm = ({ dataFromPersonalInfo, dataFromFirebase }) => {
  const { currentUser } = useAuth();
  let docRef;
  if (currentUser !== null) {
    console.log("uid ", currentUser.uid);
    docRef = doc(db, "users", currentUser.uid);
  }

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [count, setCount] = useState(0);

  const [openHelp, setOpenHelp] = useState(false);
  const [personalInfo, setPersonalInfo] = useState({
    firstName: firstName,
    lastName: lastName,
    address: address,
    city: city,
    state: state,
    zipCode: zipCode,
    phone: phone,
    email: email
  });

  useEffect(() => {
    if (currentUser !== null) {
      if (count < 1) {
        if (dataFromFirebase !== undefined) {
          const personal_info_firebase = dataFromFirebase.personal_info;

          if (personal_info_firebase !== undefined) {
            setPersonalInfo(personal_info_firebase);
            setFirstName(personal_info_firebase.firstName);
            setLastName(personal_info_firebase.lastName);
            setAddress(personal_info_firebase.address);
            setCity(personal_info_firebase.city);
            setState(personal_info_firebase.state);
            setZipCode(personal_info_firebase.zipCode);
            setPhone(personal_info_firebase.phone);
            setEmail(personal_info_firebase.email);
          }
        }
      } else {
        setPersonalInfo({
          firstName: firstName,
          lastName: lastName,
          address: address,
          city: city,
          state: state,
          zipCode: zipCode,
          phone: phone,
          email: email
        });
      }
      dataFromPersonalInfo(personalInfo);
    }

    // eslint-disable-next-line
  }, [dataFromFirebase, count]);

  const showHelpModal = () => {
    const handleClose = () => {
      setOpenHelp(false);
    };

    const sendHelpToDatabase = () => {
      setOpenHelp(false);
      //send Help to Firebase

      updateData(docRef, {
        PersonalDetailsFormHelp: true,
        lastHelpRequestDate: Timestamp.fromDate(new Date())
      });
    };
    return (
      <Dialog
        open={openHelp}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Call for Help?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            We are sorry you are having trouble in filling the form. Would you
            like Project Rebound Staff to assist you?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>No, Thank You</Button>
          <Button onClick={sendHelpToDatabase} autoFocus>
            Yes, Please
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Box>
      <Box
        sx={{
          backgroundColor: Colors.backgroundColor,
          height: "auto",
          borderRadius: "1rem",
          boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
          margin: "auto",
          paddingBottom: "2rem",
          width: "90%"
        }}
      >
        {/* Heading row */}
        <Grid container spacing={2} sx={{ margin: "auto", width: "97%" }}>
          {/* Heading Text */}
          <Grid item md={8} xs={8}>
            <Box
              sx={{
                fontWeight: "700",
                fontSize: { md: "1.3rem", sm: "1rem", xs: "1.2rem" },
                color: Colors.primaryColor
              }}
            >
              Personal Details
            </Box>
            <Box
              sx={{
                fontSize: {
                  md: "1rem",
                  sm: "0.8rem",
                  xs: "0.8rem",
                  fontFamily: "Inria Sans",
                  color: Colors.primaryColor
                }
              }}
            >
              Please add your personal details
            </Box>
          </Grid>
          {/* Help Button */}
          <Grid item md={4} xs={4}>
            <Box
              sx={{
                float: "right",
                display: "flex",
                bgcolor: { md: Colors.white, sm: Colors.white, xs: "None" },
                paddingRight: { md: "1.2rem", sm: "1rem", xs: "0.5rem" },
                paddingLeft: { md: "1.2rem", sm: "1rem", xs: "0.5rem" },
                marginRight: "0.5rem",
                cursor: "pointer"
              }}
              onClick={() => {
                setOpenHelp(true);
              }}
            >
              <Box
                sx={{
                  display: { md: "flex", sm: "flex", xs: "None" },
                  borderRadius: "0.1rem",
                  fontSize: { md: "1rem", sm: "0.7rem", xs: "0.7rem" },
                  color: Colors.primaryColor,
                  fontWeight: "700"
                }}
              >
                <p>Need Help</p>
              </Box>
              <Box
                sx={{
                  color: Colors.primaryColor,
                  marginTop: { md: "0.85rem", sm: "0.5rem", xs: "0 " },
                  marginLeft: "0.5rem"
                }}
              >
                <Icon>help_circle</Icon>
              </Box>
            </Box>
          </Grid>
        </Grid>
        <Grid
          container
          spacing={2}
          sx={{ margin: "auto", width: "97%", paddingRight: "0.5rem" }}
        >
          {/* First Name */}
          <Grid item md={6} sm={6} xs={12}>
            <Box
              component="form"
              sx={{
                "& > :not(style)": { width: "100%" }
              }}
              autoComplete="off"
            >
              <TextField
                sx={inputStyle}
                label="First Name"
                variant="filled"
                value={firstName}
                name="firstname"
                InputProps={{
                  disableUnderline: true
                }}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  setCount(count + 1);
                }}
                focused
              />
            </Box>
          </Grid>

          {/* last name        */}
          <Grid item md={6} sm={6} xs={12}>
            <Box
              component="form"
              sx={{
                "& > :not(style)": { width: "100%" }
              }}
              autoComplete="off"
            >
              <TextField
                sx={inputStyle}
                label="Last Name"
                variant="filled"
                value={lastName}
                name="lastName"
                onChange={(e) => {
                  setLastName(e.target.value);
                  setCount(count + 1);
                }}
                InputProps={{
                  disableUnderline: true
                }}
                focused
              />
            </Box>
          </Grid>

          {/* address row */}
          <Grid item xs={12}>
            <Grid item xs={12}>
              <Box
                component="form"
                sx={{
                  "& > :not(style)": { width: "100%" }
                }}
                autoComplete="off"
              >
                <TextField
                  sx={inputStyle}
                  label="Address"
                  variant="filled"
                  value={address}
                  name="address"
                  onChange={(e) => {
                    setAddress(e.target.value);
                    setCount(count + 1);
                  }}
                  focused
                  InputProps={{
                    disableUnderline: true
                  }}
                />
              </Box>
            </Grid>
          </Grid>

          {/* City */}
          <Grid item md={4} sm={4} xs={12}>
            <Box
              component="form"
              sx={{
                "& > :not(style)": { width: "100%" }
              }}
              autoComplete="off"
            >
              <TextField
                sx={inputStyle}
                label="City"
                variant="filled"
                value={city}
                name="city"
                onChange={(e) => {
                  setCity(e.target.value);
                  setCount(count + 1);
                }}
                focused
                InputProps={{
                  disableUnderline: true
                }}
              />
            </Box>
          </Grid>

          {/* State */}
          <Grid item md={4} sm={4} xs={12}>
            <Box
              component="form"
              sx={{
                "& > :not(style)": { width: "100%" }
              }}
              autoComplete="off"
            >
              <TextField
                sx={inputStyle}
                label="State"
                variant="filled"
                value={state}
                name="state"
                onChange={(e) => {
                  setState(e.target.value);
                  setCount(count + 1);
                }}
                focused
                InputProps={{
                  disableUnderline: true
                }}
              />
            </Box>
          </Grid>

          {/* Zip Code */}
          <Grid item md={4} sm={4} xs={12}>
            <Box
              component="form"
              sx={{
                "& > :not(style)": { width: "100%" }
              }}
              autoComplete="off"
            >
              <TextField
                sx={inputStyle}
                label="Zip Code"
                variant="filled"
                value={zipCode}
                name="zipCode"
                onChange={(e) => {
                  setZipCode(e.target.value);
                  setCount(count + 1);
                }}
                focused
                InputProps={{
                  disableUnderline: true
                }}
              />
            </Box>
          </Grid>

          {/* Phone */}

          <Grid item md={6} sm={6} xs={12}>
            <Box
              component="form"
              sx={{
                "& > :not(style)": { width: "100%" }
              }}
              autoComplete="off"
            >
              <TextField
                sx={inputStyle}
                label="Phone"
                variant="filled"
                value={phone}
                name="phone"
                onChange={(e) => {
                  setPhone(e.target.value);
                  setCount(count + 1);
                }}
                focused
                InputProps={{
                  disableUnderline: true
                }}
              />
            </Box>
          </Grid>

          {/* Email */}
          <Grid item md={6} sm={6} xs={12}>
            <Box
              component="form"
              sx={{
                "& > :not(style)": { width: "100%" }
              }}
              autoComplete="off"
            >
              <TextField
                sx={inputStyle}
                label="Email"
                variant="filled"
                value={email}
                name="email"
                onChange={(e) => {
                  setEmail(e.target.value);
                  setCount(count + 1);
                }}
                focused
                InputProps={{
                  disableUnderline: true
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
      {openHelp ? showHelpModal() : <div />}
    </Box>
  );
};

export default PersonalDetailsForm;
