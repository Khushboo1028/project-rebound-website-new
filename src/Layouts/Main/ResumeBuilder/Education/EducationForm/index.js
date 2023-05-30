import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Icon,
  TextField,
  FormControlLabel,
  Checkbox
} from "@mui/material";
import { Colors } from "../../../../../constants/Colors";
import {
  inputStyle,
  educationFormContainer,
  educationFormSubtitle,
  educationFormTitle,
  helpButtonContainer
} from "../../styles";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { useAuth } from "../../../../../firebase/AuthContext";

import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Timestamp, doc } from "firebase/firestore";
import { db } from "../../../../../firebase/firebase";
import { updateData } from "../../../../../firebase/firebaseReadWrite";

const EducationForm = ({ dataFromEducationInfo, dataFromFirebase }) => {
  const { currentUser } = useAuth();
  let docRef;
  if (currentUser !== null) {
    console.log("uid ", currentUser.uid);
    docRef = doc(db, "users", currentUser.uid);
  }

  const [inputList, setInputList] = useState([
    {
      schoolName: "",
      startDate: "",
      endDate: "",
      schoolLocation: "",
      degree: "",
      fieldOfStudy: "",
      currentlyEnrolled: false
    }
  ]);

  const [count, setCount] = useState(0);

  const date_options = {
    year: "numeric",
    month: "short"
  };

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [openHelp, setOpenHelp] = useState(false);

  useEffect(() => {
    if (count < 1) {
      if (currentUser !== null) {
        if (dataFromFirebase !== undefined) {
          const educationInfoFromFirebase = dataFromFirebase.education_info;

          if (
            educationInfoFromFirebase !== undefined &&
            educationInfoFromFirebase !== null
          ) {
            setInputList(educationInfoFromFirebase);
          }
        }
      }
    } else {
      dataFromEducationInfo(inputList);
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
        EducationFormHelp: true,
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

  const onAddBtnClick = () => {
    let newField = {
      schoolName: "",
      startDate: "",
      endDate: "",
      schoolLocation: "",
      degree: "",
      fieldOfStudy: "",
      currentlyEnrolled: false
    };

    setInputList([...inputList, newField]);
  };

  const removeEducationBtnClick = (index) => {
    let data = [...inputList];
    data.splice(index, 1);
    setInputList(data);
    setCount(count + 1);
  };

  const handleFormChange = (index, event) => {
    const data = [...inputList];
    if (event.target.name !== "currentlyEnrolled") {
      data[index][event.target.name] = event.target.value;
    } else {
      if (event.target.checked === true) {
        data[index]["endDate"] = "";
      }
      data[index][event.target.name] = event.target.checked;
    }

    setInputList(data);

    setCount(count + 1);
  };

  const educationFormFunction = inputList.map((input, index) => {
    return (
      <Box key={index}>
        {index === 0 ? (
          <div></div>
        ) : (
          <Grid
            container
            spacing={2}
            sx={{
              margin: "auto",
              width: "97%",
              paddingRight: "0.5rem",
              marginTop: "1rem"
            }}
          >
            <Grid item md={6} sm={6} xs={12} order={{ xs: 1 }}>
              <Box
                sx={{
                  width: "97%",
                  margin: "auto",
                  color: Colors.primaryColor,
                  fontWeight: "700"
                }}
              >
                Education #{index + 1}
              </Box>
            </Grid>

            <Grid item md={6} sm={6} xs={12} order={{ xs: 1 }}>
              <Box
                sx={{
                  color: Colors.primaryColor,
                  fontSize: { sm: "1rem", xs: "0.8rem" },
                  textAlign: "right",
                  paddingRight: "1rem",
                  cursor: "pointer"
                }}
                onClick={() => {
                  removeEducationBtnClick(index);
                }}
              >
                - Remove Education
              </Box>
            </Grid>
          </Grid>
        )}
        <Grid
          key={index}
          id={`education-form-${index}`}
          container
          spacing={2}
          sx={{ margin: "auto", width: "97%", paddingRight: "0.5rem" }}
        >
          {/* School Name */}
          <Grid item md={6} sm={6} xs={12} order={{ xs: 1 }}>
            <Box
              component="form"
              sx={{
                "& > :not(style)": { width: "100%" }
              }}
              id={`schoolName-${index}`}
            >
              <TextField
                sx={inputStyle}
                label="School Name"
                variant="filled"
                value={input.schoolName}
                name="schoolName"
                focused
                onChange={(e) => {
                  handleFormChange(index, e);
                }}
                InputProps={{
                  disableUnderline: true
                }}
              />
            </Box>
          </Grid>

          {/* Start Date*/}
          <Grid item md={6} sm={6} xs={12} order={{ xs: 2 }}>
            <Box
              component="form"
              sx={{
                "& > :not(style)": { width: "100%" }
              }}
              autoComplete="off"
              id={`startDate-${index}`}
            >
              <Grid container spacing={2}>
                <Grid item xs={3}>
                  <Box
                    sx={{
                      marginTop: "1rem",
                      color: Colors.primaryColor,
                      fontSize: "1rem",
                      fontFamily: "Inria Sans",
                      fontWeight: "700",
                      marginLeft: "0.5rem"
                    }}
                  >
                    Start Date
                  </Box>
                </Grid>
                <Grid item xs={9}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      sx={inputStyle}
                      views={["year", "month"]}
                      onChange={(date) => {
                        setStartDate(date);
                        input.startDate = new Date(date).toLocaleDateString(
                          undefined,
                          date_options
                        );
                        setCount(count + 1);
                      }}
                      format="MMM-YYYY"
                      startDate={startDate}
                    />
                  </LocalizationProvider>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          {/* End Date*/}
          <Grid item md={6} sm={6} xs={12} order={{ xs: 4 }}>
            <Box
              component="form"
              sx={{
                "& > :not(style)": { width: "100%" }
              }}
              autoComplete="off"
            >
              <Grid container spacing={2}>
                <Grid item xs={3}>
                  <Box
                    sx={{
                      marginTop: "1rem",
                      color: Colors.primaryColor,
                      fontSize: "1rem",
                      fontFamily: "Inria Sans",
                      fontWeight: "700",
                      marginLeft: "0.5rem"
                    }}
                  >
                    End Date
                  </Box>
                </Grid>
                <Grid item xs={9}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      disabled={
                        input.currentlyEnrolled !== null &&
                        input.currentlyEnrolled !== undefined
                          ? input.currentlyEnrolled
                          : false
                      }
                      sx={inputStyle}
                      views={["year", "month"]}
                      onChange={(date) => {
                        setEndDate(date);
                        input.endDate = new Date(date).toLocaleDateString(
                          undefined,
                          date_options
                        );
                        setCount(count + 1);
                      }}
                      format="MMM-YYYY"
                      startDate={endDate}
                    />
                  </LocalizationProvider>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          {/* School Location */}
          <Grid item md={6} sm={6} xs={12} order={{ xs: 3 }}>
            <Box
              component="form"
              sx={{
                "& > :not(style)": { width: "100%" }
              }}
              autoComplete="off"
            >
              <TextField
                sx={inputStyle}
                label="School Location"
                variant="filled"
                value={input.schoolLocation}
                focused
                name="schoolLocation"
                onChange={(e) => {
                  handleFormChange(index, e);
                }}
                id={`schoolLocation-${index}`}
                InputProps={{
                  disableUnderline: true
                }}
              />
            </Box>
          </Grid>

          {/* Empty Space */}
          <Grid item md={6} sm={6} xs={12} order={{ xs: 5 }}></Grid>

          {/* Degree*/}
          <Grid item md={6} sm={6} xs={12} order={{ xs: 6 }}>
            <Box
              component="form"
              sx={{
                "& > :not(style)": { width: "100%" }
              }}
              autoComplete="off"
            >
              <TextField
                sx={inputStyle}
                label="Degree"
                focused
                variant="filled"
                value={input.degree}
                name="degree"
                onChange={(e) => {
                  handleFormChange(index, e);
                }}
                id={`fieldOfStudy-${index}`}
                InputProps={{
                  disableUnderline: true
                }}
              />
            </Box>
          </Grid>

          {/* Degree */}
          <Grid item md={6} sm={6} xs={12} order={{ xs: 5 }}>
            <Box
              component="form"
              sx={{
                marginLeft: "0.5rem",
                "& > :not(style)": { width: "100%" }
              }}
              autoComplete="off"
            >
              <FormControlLabel
                sx={inputStyle}
                control={
                  <Checkbox
                    sx={inputStyle}
                    name="currentlyEnrolled"
                    checked={
                      input.currentlyEnrolled !== null &&
                      input.currentlyEnrolled !== undefined
                        ? input.currentlyEnrolled
                        : false
                    }
                    onChange={(e) => {
                      handleFormChange(index, e);
                    }}
                  />
                }
                label="I am currently enrolled here"
              />
            </Box>
          </Grid>

          {/* Field of Study */}
          <Grid item md={6} sm={6} xs={12} order={{ xs: 6 }}>
            <Box
              component="form"
              sx={{
                "& > :not(style)": { width: "100%" }
              }}
              autoComplete="off"
            >
              <TextField
                sx={inputStyle}
                label="Field Of Study"
                focused
                variant="filled"
                value={input.fieldOfStudy}
                name="fieldOfStudy"
                onChange={(e) => {
                  handleFormChange(index, e);
                }}
                id={`fieldOfStudy-${index}`}
                InputProps={{
                  disableUnderline: true
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    );
  });

  return (
    <Box sx={educationFormContainer}>
      <Grid container spacing={2} sx={{ margin: "auto", width: "97%" }}>
        {/* Heading Row */}

        <Grid item md={8} xs={8}>
          <Box sx={educationFormTitle}>Education/School</Box>
          <Box sx={educationFormSubtitle}>
            You can add relevant courses, bootcamps or programs that you are
            enrolled in.
          </Box>
        </Grid>

        {/* Help Button */}
        <Grid item md={4} xs={4}>
          <Box
            sx={helpButtonContainer}
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

      {educationFormFunction}

      {/* Button to add another block */}
      <Grid container spacing={2} sx={{ margin: "auto", width: "97%" }}>
        <Grid item md={6} xs={3}></Grid>
        <Grid item md={6} xs={9}>
          <Box
            sx={{
              color: Colors.primaryColor,
              fontSize: { sm: "1rem", xs: "0.8rem" },
              textAlign: "end",
              marginTop: "1rem",
              paddingRight: "1rem",
              cursor: "pointer"
            }}
            onClick={onAddBtnClick}
          >
            + Add Another Education
          </Box>
        </Grid>
      </Grid>
      {openHelp ? showHelpModal() : <div />}
    </Box>
  );
};

export default EducationForm;
