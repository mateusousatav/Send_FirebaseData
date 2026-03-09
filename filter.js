import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { db } from "./firebase-config.js";

// You need to import the database reference that you already created instead of making a new one
//### step-2:
const pizzaQuery = query(
    collection(db, "orders"),
    where("status","==","ready")
    // where taken in three clauses, similar to a for loop, seperated by commas.
    // for(int i=0; i<orders.length; i++){}
);

const snapshot = await getDocs(pizzaQuery);
// snapshot returns an object that has a list of documents

//##step-3: Loop through the results
snapshot.forEach((doc)=>{
    console.log(doc.id, "=>", doc.data());
});


//#step-4: Display the results in the HTML
const list = document.getElementById("orders");
// Look at the filter.html file, you will see that the UL has a id called orders
snapshot.forEach((doc) => {
 const data = doc.data();
//creating another variable called data to store the data of the document, so that we can use it to display the name and item in the list
 const li = document.createElement("li");
//  li.textContent = data.name + " ordered " + data.item +" which is "+ data.status;
li.textContent = data.name + " - " + data.item + " - " + data.status;
 list.appendChild(li);


});