import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs, doc } from "firebase/firestore";
import { db } from "../../../firebase/firebase";

import { Colors } from "../../../constants/Colors";
import { Box } from "@mui/material";
import { DataGrid, GridToolbar, GridActionsCellItem } from "@mui/x-data-grid";

import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { updateData } from "../../../firebase/firebaseReadWrite";

const Help = () => {
  const [helpData, setHelpData] = useState([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (count < 1) {
      getAllDocs();
      setCount(count + 1);
    }
    // eslint-disable-next-line
  }, []);

  const getAllDocs = async () => {
    const q = query(
      collection(db, "users"),
      where("lastHelpRequestDate", "!=", null)
    );
    const querySnapshot = await getDocs(q);
    let data = [];
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      // console.log(doc.id, " => ", doc.data());

      if (doc.id !== "h9IvP69YaPfmcNFiqx78VUnwJ0v2") {
        let personData = doc.data();
        let firstName = "";
        let lastName = "";
        let email = "";
        let lastHelpDate = new Date();
        let keySkillsHelp = false;
        let educationHelp = false;
        let personalInfoHelp = false;
        let ObjectiveFieldHelp = false;
        let professionalExperienceFormHelp = false;
        let resolved = false;

        if (
          personData.personal_info !== null &&
          personData.personal_info !== undefined
        ) {
          if (
            personData.personal_info.firstName !== null &&
            personData.personal_info.firstName !== undefined
          ) {
            firstName = personData.personal_info.firstName;
          }
        }

        if (
          personData.personal_info !== null &&
          personData.personal_info !== undefined
        ) {
          if (
            personData.personal_info.lastName !== null &&
            personData.personal_info.lastName !== undefined
          ) {
            lastName = personData.personal_info.lastName;
          }
        }

        if (
          personData.personal_info !== null &&
          personData.personal_info !== undefined
        ) {
          if (
            personData.personal_info.email !== null &&
            personData.personal_info.email !== undefined
          ) {
            email = personData.personal_info.email;
          }
        }

        if (
          personData.lastHelpRequestDate !== null &&
          personData.lastHelpRequestDate !== undefined
        ) {
          lastHelpDate = personData.lastHelpRequestDate.toDate().toDateString();
        }

        if (
          personData.ProfessionalExperienceFormHelp !== null &&
          personData.ProfessionalExperienceFormHelp !== undefined
        ) {
          professionalExperienceFormHelp =
            personData.ProfessionalExperienceFormHelp;
        }

        if (
          personData.PersonalDetailsFormHelp !== null &&
          personData.PersonalDetailsFormHelp !== undefined
        ) {
          personalInfoHelp = personData.PersonalDetailsFormHelp;
        }

        if (
          personData.KeySkillsHelp !== null &&
          personData.KeySkillsHelp !== undefined
        ) {
          keySkillsHelp = personData.KeySkillsHelp;
        }

        if (
          personData.ObjectiveFormHelp !== null &&
          personData.ObjectiveFormHelp !== undefined
        ) {
          ObjectiveFieldHelp = personData.ObjectiveFormHelp;
        }

        if (
          personData.EducationFormHelp !== null &&
          personData.EducationFormHelp !== undefined
        ) {
          educationHelp = personData.EducationFormHelp;
        }

        if (
          personData.helpResolved !== null &&
          personData.helpResolved !== undefined
        ) {
          resolved = personData.helpResolved;
        }

        data.push({
          id: data.length,
          userId: doc.id,
          firstName: firstName,
          lastName: lastName,
          email: email,
          lastHelpDate: lastHelpDate,
          keySkillsHelp: keySkillsHelp,
          educationHelp: educationHelp,
          personalInfoHelp: personalInfoHelp,
          ObjectiveFieldHelp: ObjectiveFieldHelp,
          professionalExperienceFormHelp: professionalExperienceFormHelp,
          resolved: resolved
        });
        // console.log("data is ", data);
      }
    });

    setHelpData(data);
  };

  let columns = [
    {
      headerName: "First Name",
      field: "firstName",
      minWidth: 150,
      resizable: true
    },
    { headerName: "Last Name", field: "lastName", minWidth: 150 },
    { headerName: "Email", field: "email", minWidth: 200 },
    {
      headerName: "Last Help Date",
      field: "lastHelpDate",
      minWidth: 180
    },
    {
      headerName: "Personal Info",
      field: "personalInfoHelp",
      type: "boolean"
    },
    {
      headerName: "Objective Field",
      field: "ObjectiveFieldHelp",
      minWidth: 150,
      type: "boolean"
    },
    {
      headerName: "Education",
      field: "educationHelp",
      type: "boolean"
    },
    {
      headerName: "Professional Experience",
      field: "professionalExperienceFormHelp",
      type: "boolean"
    },
    {
      headerName: "Key Skills",
      field: "keySkillsHelp",
      type: "boolean"
    },
    {
      headerName: "Resolved",
      field: "resolved",
      type: "actions",
      getActions: (params) => {
        if (params.row.resolved === false) {
          return [
            <GridActionsCellItem
              icon={
                <CloseIcon
                  sx={{
                    background: "#e74c3c",
                    borderRadius: "5px",
                    padding: "10px",
                    color: Colors.white
                  }}
                />
              }
              label="No"
              onClick={updateHelp(params.id, true, params.row)}
            />
          ];
        } else {
          return [
            <GridActionsCellItem
              icon={
                <CheckIcon
                  sx={{
                    background: "#2ecc71",
                    borderRadius: "5px",
                    padding: "10px",
                    color: Colors.white
                  }}
                />
              }
              label="Yes"
              onClick={updateHelp(params.id, false, params.row)}
            />
          ];
        }
      }
    }
  ];

  const updateHelp = React.useCallback(
    (id, value, row) => () => {
      console.log("here");

      setTimeout(() => {
        if (row !== undefined && row.userId !== undefined) {
          let uid = row.userId;
          let docRef = doc(db, "users", uid);
          updateData(docRef, {
            helpResolved: value
          });
          alert("Field is updated");
        }
      });

      setTimeout(() => {
        getAllDocs();
      }, 1000);
    },
    // eslint-disable-next-line
    []
  );

  return (
    <div style={{ padding: "1rem", marginTop: "3rem" }}>
      <Box
        sx={{
          background: Colors.backgroundColor,
          padding: "1rem",
          marginTop: "10rem",
          height: "auto",
          borderRadius: "1rem",
          boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
          margin: "auto",
          width: "95%"
        }}
      >
        <DataGrid
          rows={helpData}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 }
            }
          }}
          pageSizeOptions={[5, 10]}
          // slots={{
          //   toolbar: GridToolbar
          // }}
          components={{
            Toolbar: GridToolbar
          }}
          sx={{
            "&.css-1knaqv7-MuiButtonBase-root-MuiButton-root": {
              color: "#000"
            }
          }}
        />
      </Box>
    </div>
  );
};

export default Help;
