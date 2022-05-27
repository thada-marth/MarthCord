import React from "react";
import { getDoc ,doc } from "firebase/firestore";
import { db } from "../firebaseconfig"

// for checking specific information in users collection
const runningTask = async (uid) => {
  const userRef = await getDoc(doc(db,"users",uid)) //get direct specific
  const userData = await userRef.data()
  console.log(userData?.email)
  if(!userData?.email){
    console.log("Email - NotFound");
  }
}

// const runningTask = async (uid) => {
//   const userRef = await getDoc(doc(db,"users",uid))
//   const userData = await userRef.data()
//   console.log(userData)
//   if(!userData){
//     console.log("NotFound");
//   }
// }


export default function Checknickname({uid}) {

  runningTask(uid);
  return <></>;
}
