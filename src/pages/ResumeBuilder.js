import React, { useEffect, useState } from "react";
import KeySkills from "../Layouts/Main/ResumeBuilder/KeySkills";
import NavigationButtons from "../Layouts/Main/ResumeBuilder/NavigationButtons";
import PersonalDetailsForm from "../Layouts/Main/ResumeBuilder/PersonalDetailsForm";
import ResumeBuilderIntro from "../Layouts/Main/ResumeBuilder/ResumeBuilderIntro";
import { useAuth } from "../firebase/AuthContext";
import { useNavigate, createSearchParams } from "react-router-dom";
import EducationBlock from "../Layouts/Main/ResumeBuilder/Education/EducationBlock";
import ProfessionalExperienceBlock from "../Layouts/Main/ResumeBuilder/ProfessionalExperience/ProfessionalExperienceBlock";
import { Timestamp } from "firebase/firestore";
import Navbar from "../Layouts/Navbar";
import Footer from "../Layouts/Footer";
import ObjectiveForm from "../Layouts/Main/ResumeBuilder/ObjectiveForm";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";

const ResumeBuilder = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  let docRef;
  if (currentUser !== null) {
    docRef = doc(db, "users", currentUser.uid);
  }

  const [personalInfo, setPersonalInfo] = useState();
  const [educationInfo, setEducationInfo] = useState();
  const [professionalExperienceInfo, setProfessionalExperienceInfo] =
    useState();
  const [skillsInfo, setSkillsInfo] = useState();
  const [objective, setObjective] = useState();

  const [dataFromFirebase, setDatafromFirebase] = useState();

  const resumeData = {
    date_resume_updated: Timestamp.fromDate(new Date()),
    personal_info: personalInfo,
    education_info: educationInfo,
    professional_experience_info: professionalExperienceInfo,
    skills_info: skillsInfo,
    objective: objective
  };

  useEffect(() => {
    if (currentUser) {
      navigate("/resumeBuilder");

      const unsubscribe = onSnapshot(docRef, (doc) => {
        const newList = doc.data();
        console.log("firebase data is ", newList);
        setDatafromFirebase(newList);
      });

      return () => {
        unsubscribe();
      };
    } else {
      navigate({
        pathname: "/login",
        search: createSearchParams({ fromPath: "/resumeBuilder" }).toString()
      });
    }
    // eslint-disable-next-line
  }, [currentUser, navigate]);

  const dataFromPersonalInfo = (personalInfo) => {
    console.log("personal info is ", personalInfo);
    if (personalInfo.firstName === "") {
      setPersonalInfo({});
    } else {
      setPersonalInfo(personalInfo);
    }
  };

  const dataFromEducationInfo = (educationInfo) => {
    setEducationInfo(educationInfo);
  };

  const dataFromObjective = (objectiveInfo) => {
    console.log(objectiveInfo);
    if (objectiveInfo.isSkipped) {
      setObjective(null);
    } else {
      if (
        objectiveInfo.objective === undefined ||
        objectiveInfo.objective === ""
      ) {
        setObjective("");
      } else {
        //setting from props

        console.log("objective is ", objective);
      }
    }
  };

  const dataFromProfessionalExperienceInfo = (professionalExperienceInfo) => {
    setProfessionalExperienceInfo(professionalExperienceInfo);
  };

  const dataFromSkillsInfo = (skillsInfo) => {
    setSkillsInfo(skillsInfo);
  };

  return (
    <div>
      <Navbar />
      <div>
        <ResumeBuilderIntro />
        <div style={{ padding: "1rem", marginTop: "3rem" }}>
          <ObjectiveForm
            dataFromObjective={dataFromObjective}
            dataFromFirebase={dataFromFirebase}
          />
        </div>

        <div style={{ padding: "1rem", marginTop: "0.5rem" }}>
          <PersonalDetailsForm
            dataFromPersonalInfo={dataFromPersonalInfo}
            dataFromFirebase={dataFromFirebase}
          />
        </div>
        <div style={{ padding: "1rem", marginTop: "0.5rem" }}>
          <EducationBlock
            dataFromEducationInfoFromProps={dataFromEducationInfo}
            dataFromFirebase={dataFromFirebase}
          />
        </div>

        <div>
          <ProfessionalExperienceBlock
            dataFromProfessionalExperienceInfoProps={
              dataFromProfessionalExperienceInfo
            }
            dataFromFirebase={dataFromFirebase}
          />
        </div>
        <div style={{ padding: "1rem", marginTop: "0.5rem" }}>
          <KeySkills
            dataFromSkillsInfo={dataFromSkillsInfo}
            dataFromFirebase={dataFromFirebase}
          />
        </div>

        <div style={{ padding: "1rem", marginTop: "0.5rem" }}>
          <NavigationButtons
            resumeData={resumeData}
            dataFromFirebase={dataFromFirebase}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ResumeBuilder;
