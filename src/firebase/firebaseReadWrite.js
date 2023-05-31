import { updateDoc, setDoc } from "firebase/firestore";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";

export const addData = async (docRef, docData) => {
  console.log("docRef:", docRef);
  await setDoc(docRef, docData, { merge: true })
    .then(console.log("Document added"))
    .catch((e) => {
      console.log("error is ", e);
    });
};

export const updateData = async (docRef, docData) => {
  await updateDoc(docRef, docData, { merge: true })
    .then(console.log("Document updated"))
    .catch((e) => {
      console.log("error is ", e);
    });
};

export const addVideoData = async (collectionName, docData) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), docData);
    console.log("Document added with ID: ", docRef.id);
  } catch (e) {
    console.log("Error adding document:", e);
  }
};
