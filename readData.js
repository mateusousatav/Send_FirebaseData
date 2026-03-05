import {getDatabase,ref,onValue} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

//created a database reference to the orders node in the Firebase Realtime Database
const db = getDatabase();
const ordersRef = ref(db, 'orders');

// created a function called readData that listens for changes to the orders node 
// and logs the data to the console.
// If there is an error while reading the data,
// it logs the error message to the console.
function readData() {
  onValue(ordersRef, (snapshot) => {
    const data = snapshot.val();
    console.log(data);
  }, (error) => {
    console.error("Error reading data: ", error);
  });
}