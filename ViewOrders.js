import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const userStatus = document.getElementById("userStatus");
  const ordersContainer = document.getElementById("ordersContainer");
  const loadingMsg = document.getElementById("loadingMsg");
  const backBtn = document.getElementById("backBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const editModal = document.getElementById("editModal");
  const editForm = document.getElementById("editForm");
  const closeModal = document.querySelector(".close");
  
  let currentOrderId = null;

  // Close modal when X is clicked
  closeModal.addEventListener("click", () => {
    editModal.style.display = "none";
  });

  // Close modal when clicking outside of it
  window.addEventListener("click", (event) => {
    if (event.target === editModal) {
      editModal.style.display = "none";
    }
  });

  // Listen for auth state changes
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      userStatus.textContent = "Logged in as: " + user.email;
      // Fetch and display orders
      await displayOrders(user.uid);
    } else {
      userStatus.textContent = "Not logged in. Redirecting...";
      setTimeout(() => {
        window.location.href = "login.html";
      }, 2000);
    }
  });

  // Function to display orders
  async function displayOrders(userId) {
    try {
      const q = query(
        collection(db, "orders"),
        where("userId", "==", userId)
      );

      const querySnapshot = await getDocs(q);
      
      // Sort orders by timestamp (newest first) on the client side
      const docs = querySnapshot.docs.sort((a, b) => {
        const timeA = a.data().timestamp?.toDate() || new Date(0);
        const timeB = b.data().timestamp?.toDate() || new Date(0);
        return timeB - timeA;
      });

      if (docs.length === 0) {
        ordersContainer.innerHTML = '<p class="no-orders">No orders found. Start by placing an order!</p>';
        return;
      }

      let html = '<table><thead><tr><th>Item</th><th>Quantity</th><th>Total Price</th><th>Date</th><th>Actions</th></tr></thead><tbody>';

      docs.forEach((doc) => {
        const order = doc.data();
        const date = order.timestamp ? new Date(order.timestamp.toDate()).toLocaleDateString() : "N/A";
        
        html += `
          <tr>
            <td>${order.item}</td>
            <td>${order.quantity}</td>
            <td>$${order.totalPrice.toFixed(2)}</td>
            <td>${date}</td>
            <td class="action-buttons">
              <button class="edit-btn" onclick="window.openEditModal('${doc.id}', '${order.item}', ${order.quantity}, ${order.totalPrice})">Edit</button>
              <button class="delete-btn" onclick="window.deleteOrder('${doc.id}')">Delete</button>
            </td>
          </tr>
        `;
      });

      html += '</tbody></table>';
      ordersContainer.innerHTML = html;
    } catch (error) {
      ordersContainer.innerHTML = `<p style="color: red;">Error loading orders: ${error.message}</p>`;
      console.error("Error fetching orders:", error);
    }
  }

  // Function to open edit modal
  window.openEditModal = (orderId, item, quantity, totalPrice) => {
    currentOrderId = orderId;
    document.getElementById("editItem").value = item;
    document.getElementById("editQuantity").value = quantity;
    document.getElementById("editTotalPrice").value = totalPrice;
    editModal.style.display = "block";
  };

  // Function to delete order
  window.deleteOrder = async (orderId) => {
    if (confirm("Are you sure you want to delete this order?")) {
      try {
        await deleteDoc(doc(db, "orders", orderId));
        alert("Order deleted successfully!");
        // Refresh the orders list
        const user = auth.currentUser;
        await displayOrders(user.uid);
      } catch (error) {
        alert("Error deleting order: " + error.message);
        console.error("Delete error:", error);
      }
    }
  };

  // Handle edit form submission
  editForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const item = document.getElementById("editItem").value;
    const quantity = Number(document.getElementById("editQuantity").value);
    const totalPrice = Number(document.getElementById("editTotalPrice").value);

    try {
      await updateDoc(doc(db, "orders", currentOrderId), {
        item: item,
        quantity: quantity,
        totalPrice: totalPrice
      });
      alert("Order updated successfully!");
      editModal.style.display = "none";
      // Refresh the orders list
      const user = auth.currentUser;
      await displayOrders(user.uid);
    } catch (error) {
      alert("Error updating order: " + error.message);
      console.error("Update error:", error);
    }
  });

  // Handle back button
  backBtn.addEventListener("click", () => {
    window.location.href = "Order.html";
  });

  // Handle logout
  logoutBtn.addEventListener("click", async () => {
    try {
      await signOut(auth);
      alert("Logged out successfully!");
      window.location.href = "login.html";
    } catch (error) {
      alert("Error logging out: " + error.message);
    }
  });
});