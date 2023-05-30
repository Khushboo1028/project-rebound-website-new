import { updateDoc, setDoc } from "firebase/firestore";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";

// const docData = {
//   stringExample: "Hello world!",
//   booleanExample: true,
//   numberExample: 3.14159265,
//   dateExample: Timestamp.fromDate(new Date("December 10, 1815")),
//   arrayExample: [5, true, "hello"],
//   nullExample: null,
//   objectExample: {
//       a: 5,
//       b: {
//           nested: "foo"
//       }
//   }
// };

// let docRef = doc(db, collectionName, documentName);
export const addData = async (docRef, docData) => {
  console.log('docRef:', docRef);
  await setDoc(docRef, docData, { capital: true }, { merge: true })
    .then(console.log("Document added"))
    .catch((e) => {
      console.log("error is ", e);
    });
};

export const updateData = async (docRef, docData) => {
  await updateDoc(docRef, docData, { capital: true }, { merge: true })
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



// export const readData = async (docRef) => {
//   const unsub = onSnapshot(docRef, (doc) => {
//     const source = doc.metadata.hasPendingWrites ? "Local" : "Server";
//     console.log(" data: ", doc.data());
//     return doc.data;
//   });

//   return unsub;
// };
