import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase"

//reg a new user and creates their firestore doc
export const registerUser = async (email, password, srn, name) => {
    try {

    if (!/^[A-Za-z0-9]{13}$/.test(srn)) {
            throw new Error("SRN must be exactly 13 alphanumeric characters.");
          }
      
          //checks if srn already exists in firebase
          const srnQuery = query(collection(db, "users"), where("srn", "==", srn));
          const srnSnapshot = await getDocs(srnQuery);
          if (!srnSnapshot.empty) {
            throw new Error("SRN already registered. Please use a different one.");
          }
      //create user in firebase auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      //store additional data
      await setDoc(doc(db, "users", user.uid), {
        email,
        srn,
        name,
        createdAt: new Date().toISOString()
      });
  
      console.log("User registered and saved to Firestore!");
      return { success: true };
    } catch (error) {
      console.error("Registration failed:", error.message);
      return { success: false, error: error.message };
    }
  };