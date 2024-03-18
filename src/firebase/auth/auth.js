import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth, fireDB, provider } from "../firebaseconfig";
import { addDoc, collection } from "firebase/firestore";

const login = async ({ email, password }) => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.log("Error on Login", error);
  }
};

const createUser = async ({ name, email, password }) => {
  try {
    const users = await createUserWithEmailAndPassword(auth, email, password);
    let today = new Date();
    let date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();
    let time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
   

    const user = {
      name: name,
      uid: users.user?.uid || "",
      email: users.user?.email,
      time: date + " " + time,
    };
    const userRef = collection(fireDB, "users");
    await addDoc(userRef, user);
    return user;
  } catch (error) {
    console.log("firebase server:: getuser:: error ", error);
  }
};

const createuserBygoogle = async () => {
  signInWithPopup(auth, provider)
    .then((userCredential) => {
      // Signed in successfully
      const users = userCredential.user;

      let today = new Date();
      let date =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate();
      let time =
        today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

      const user = {
        name: users.displayName,
        uid: users.uid || "",
        email: users.email,
        time: date + " " + time,
      };
      const userRef = collection(fireDB, "users");
       addDoc(userRef, user);
      console.log("User signed in with Google:", user);

      return user;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Error signing in with Google:", errorMessage, errorCode);
    });
};

const getCurrentUser = async () => {
  try {
    const user = await auth.currentUser;
    if (user) {
      console.log(user)
      return user;
    } else {
      console.log("logout");
    }
  } catch (error) {
    console.log("appwrite server:: getuser:: error ", error);
  }
  return null;
};

export { createUser, createuserBygoogle, login, getCurrentUser };
