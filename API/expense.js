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
