import React from "react";
import { getDoc ,doc , setDoc } from "firebase/firestore";
import { db } from "../firebaseconfig"
import Swal from "sweetalert2";

// for checking specific information in users collection
// const runningTask = async (uid) => {
//   const userRef = await getDoc(doc(db,"users",uid)) //get direct specific
//   const userData = await userRef.data()
//   console.log(userData?.email)
//   if(!userData?.email){
//     console.log("Email - NotFound");
//   }
// }


const checkDB = async (uid , email) => {
  const userRef = await getDoc(doc(db,"users",uid))
  const userData = await userRef.data()
  if(!userData){
    setProfile(uid ,email);
  }
}

const setProfile = async (uid , email) => {
  const { value: nickname } = await Swal.fire({
    title: "Set you nickname",
    input: "text",
    inputLabel: "how we calling you?",
    inputPlaceholder: "MarthCord",
  });
  if (!nickname) {
    checkDB(uid)
  }
  if (nickname) {
    await setDoc(doc(db, "users", uid), {
      email:email,
      nickname: nickname,
      uid: uid,
    });
  }
};

export default function Checknickname({uid,email}) {
  if (uid && email){
    checkDB(uid,email);
  }
  return <></>;
}
