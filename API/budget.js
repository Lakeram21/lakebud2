import {db, auth} from "./config"
import {getDoc,addDoc, getDocs, collection, query, where, updateDoc, doc, deleteDoc} from  'firebase/firestore'
import {
  deleteUser as authDeleteUser,
  UserCredential,
} from "firebase/auth";

const userId = auth.currentUser?.uid
// Collection reference
const budgetCollectionRef = collection(db,"budget")

// Create new user
export const createBudget = async (data) => {
    const userId = auth.currentUser?.uid
    try {
      const newBudget = await addDoc(budgetCollectionRef, {
       incomes: data.incomes,
       expense: data.expenses,
       savings: data.savings,
       startDate: data.startDate,
       endDate: data.endDate,
       name: data.budgetName,
       status: data.status,
       user: userId
      });
      return {"success": newBudget};

    } catch (err) {
      return err;
    }
  };

  // Get Single budget
export const getBudgetById = async (id) => {
  const budgetDocRef = doc(db, "budget", id); // Reference to the document by its ID

  try {
    const budgetDocSnapshot = await getDoc(budgetDocRef);

    if (budgetDocSnapshot.exists()) {
      return { id: budgetDocSnapshot.id, ...budgetDocSnapshot.data() };
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error getting budget by ID:", error);
    throw error;
  }
};


// Getting all budgets
export const getAllBudgets = async () => {
  const userId = auth.currentUser?.uid;
  if (!userId) {
    return { error: "User is not authenticated" };
  }
  try {
    const querySnapshot = await getDocs(query(budgetCollectionRef, where("user", "==", userId)));
    const budgets = [];
    querySnapshot.forEach((doc) => {
      budgets.push({ id: doc.id, ...doc.data() });
    });
    return { success: budgets };
  } catch (error) {
    return error;
  }
};

// Edit budget
export const updateBudget = async (id, newData) => {
  const budgetDocRef = doc(db, "budget", id);

  try {
    const result = await updateDoc(budgetDocRef, newData);
    return {success:true}
  } catch (error) {
    console.error("Error updating document:", error);
    return error
  }
};

export const getCurrentBudget = async (status)=>{
  const userQuery = query(budgetCollectionRef, where("status", "==", status));

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
  console.error("Error getting budget by id:", error);
  throw error;
}
}