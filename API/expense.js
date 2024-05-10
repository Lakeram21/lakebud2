import {db, auth} from "./config"
import {getDoc,addDoc, getDocs, collection, query, where, updateDoc, doc, deleteDoc} from  'firebase/firestore'
import {
  deleteUser as authDeleteUser,
  UserCredential,
} from "firebase/auth";

// Collection reference
const collectionRef = collection(db,"expense")

export const createExpense = async (data) => {
    const userId = auth.currentUser?.uid
    try {
      const result = await addDoc(collectionRef, {
      
       startDate: data.startDate,
       endDate: data.endDate,
       savings: data.savings,
       budgetName: data.budgetName,
       incomes: data.incomes,
       expense: data.expenses,
       unbudgetedAmount:data.unbudgetedAmount,
       budgetId: data.budgetId,
       user: userId,
       
      });
      return {"success": result};

    } catch (err) {
      return err;
    }
  };


export const getActualExpense = async (id)=>{
  const userQuery = query(collectionRef, where("budgetId", "==", id));

  try {
    // Get the documents that match the query
    const querySnapshot = await getDocs(userQuery);

    // Check if there are matching documents
    if (querySnapshot.empty) {
      console.log('No matching documents.');
      return null;
    }
    const result = querySnapshot.docs.map((doc)=>({...doc.data(), id:doc.id}));
    
    return result[0]; 

} catch (error) {
  console.error("Error getting budget by id:", error);
  throw error;
}
}

export const updateExpense = async (id, newData) => {
  const docRef = doc(db, "expense", id);

  try {
    const result = await updateDoc(docRef, newData);
    return {success:true}
  } catch (error) {
    console.error("Error updating document:", error);
    return error
  }
};