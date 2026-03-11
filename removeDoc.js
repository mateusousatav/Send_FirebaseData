import {db} from './firebase-config.js';
import { doc, deleteDoc, updateDoc, deleteField} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Now we want to turn this into a function that will be triggered on the buttonClick in a html page
// We want to first grab the button click and then call this function to delete the document with id "delete1" from the "orders" collection in Firestore

export async function removeDoc1() {
  try {
    // Grab the order ID from an input field in the HTML page
    const orderId = document.getElementById("orderIdInput").value;
    // Create a reference to the document we want to delete
    const orderRef = doc(db, "orders", orderId);
    // Delete the document
    await deleteDoc(orderRef);

    console.log("Document with ID_"+orderId+" deleted successfully.");
  } catch (error) {
    console.error("Error deleting document: ", error);
  }
}

const button = document.getElementById("del1");
button.addEventListener("click", removeDoc1);

//Now we want to focus on deleting a specific feild from a document, not the whole document itself

export async function removeField(){
    try{
        const delRef = doc(db, "orders", "order1");
        await updateDoc(delRef, {
            studentId: deleteField()
        })
        alert("Field deleted successfully.");
    }
    catch(error){
        console.error("Error deleting field: ", error);
    }
};


const button2 = document.getElementById("deleteFields");
button2.addEventListener("click", removeField);