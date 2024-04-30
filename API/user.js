import {db, auth} from "./config"
import {getDoc,addDoc, getDocs, collection, query, where, updateDoc, doc, deleteDoc} from  'firebase/firestore'
import {
  deleteUser as authDeleteUser,
  UserCredential,
} from "firebase/auth";

const userId = auth.currentUser?.uid
// Collection reference
const userCollectionRef = collection(db,"user")

// Create new user
export const createUser = async (userData) => {
    try {
      const newUser = await addDoc(userCollectionRef, {
        uid: userData.uid,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
      });
      return newUser;

    } catch (err) {
      return err;
    }
  };

export const getUserById = async (id)=>{
  const userQuery = query(userCollectionRef, where("uid", "==", id));

  try {
    // Get the documents that match the query
    const querySnapshot = await getDocs(userQuery);

    // Check if there are matching documents
    if (querySnapshot.empty) {
      console.log('No matching documents.');
      return null;
    }
    const userDetail = querySnapshot.docs.map((doc)=>({...doc.data(), id:doc.id}));
    
    return userDetail[0]; 

} catch (error) {
  console.error("Error getting user by id:", error);
  throw error;
}
}

export const getCurrentUser = async ()=>{
    try {
      console.log(auth)
      const account = auth.currentUser
      if(!account) throw Error

      const user = await getUserById(account.uid)
      if(!user) throw Error

      return user
      
    } catch (error) {
      console.log(error)
    }
}