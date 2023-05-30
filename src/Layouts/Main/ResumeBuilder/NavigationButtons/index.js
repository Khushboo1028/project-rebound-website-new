import React, { useState } from "react";
import { Box, Grid, Button, Modal } from "@mui/material";
import { formBackground } from "../styles";
import { Colors } from "../../../../constants/Colors";
import { updateData } from "../../../../firebase/firebaseReadWrite";
import { useAuth } from "../../../../firebase/AuthContext";
import { db } from "../../../../firebase/firebase";
import { doc } from "firebase/firestore";

import PDFPage from "../../../../pages/PDFPage";

const NavigationButtons = ({ resumeData, dataFromFirebase }) => {
  const { currentUser } = useAuth();

  let docRef;
  if (currentUser !== null) {
    docRef = doc(db, "users", currentUser.uid);
  }

  const [isResumeBtnClicked, setResumeBtnClicked] = useState(false);

  const generatePdf = () => {
    saveData();
    setResumeBtnClicked(true);
  };

  const saveData = () => {
    if (resumeData.education_info === undefined) {
      if (dataFromFirebase.education_info !== undefined) {
        resumeData.education_info = dataFromFirebase.education_info;
      } else {
        resumeData.education_info = null;
      }
    }
    if (resumeData.professional_experience_info === undefined) {
      if (dataFromFirebase.professional_experience_info !== undefined) {
        resumeData.professional_experience_info =
          dataFromFirebase.professional_experience_info;
      } else {
        resumeData.professional_experience_info = null;
      }
    }

    if (JSON.stringify(resumeData.personal_info) === "{}") {
      if (dataFromFirebase.personal_info !== undefined) {
        resumeData.personal_info = dataFromFirebase.personal_info;
      }
    }

    if (resumeData.objective !== undefined) {
      if (resumeData.objective === "") {
        if (dataFromFirebase.objective !== undefined) {
          resumeData.objective = dataFromFirebase.objective;
        } else {
          resumeData.objective = null;
        }
      }
    } else {
      resumeData.objective = null;
    }

    console.log("data to send: ", resumeData);
    updateData(docRef, resumeData);
  };

  const openResumeDownloadModel = () => {
    const handleClose = () => setResumeBtnClicked(false);

    return (
      <Modal
        open={isResumeBtnClicked}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        closeAfterTransition
      >
        <PDFPage resumeData={resumeData} />
      </Modal>
    );
  };

  return (
    <Box sx={formBackground}>
      <Grid container spacing={2}>
        <Grid item sm={6} xs={12}>
          <Box></Box>
        </Grid>
        <Grid item sm={6} xs={12}>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Box>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: Colors.primaryColor,
                  fontSize: { md: "1rem", sm: "0.7rem", xs: "0.5rem" },
                  "&:hover": { backgroundColor: Colors.primaryColor }
                }}
                onClick={saveData}
              >
                Save Progress
              </Button>
            </Box>
            <Box>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: Colors.primaryColor,
                  fontSize: { md: "1rem", sm: "0.7rem", xs: "0.5rem" },
                  marginLeft: "1rem",
                  "&:hover": { backgroundColor: Colors.primaryColor }
                }}
                onClick={generatePdf}
              >
                Generate PDF
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
      <div>{openResumeDownloadModel()}</div>
    </Box>
  );
};

export default NavigationButtons;
