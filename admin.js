// --- IMPORTANT: PASTE YOUR FIREBASE CONFIG OBJECT HERE ---
const firebaseConfig = {
  apiKey: "AIzaSyAY17Qc2LyUR_UCcY_-b1oDNorz-4Jonoc",
  authDomain: "admin-portal-33925.firebaseapp.com",
  projectId: "admin-portal-33925",
  storageBucket: "admin-portal-33925.firebasestorage.app",
  messagingSenderId: "781424827329",
  appId: "1:781424827329:web:38f7e079119c53f2eead40",
  measurementId: "G-92E10DH6EL"
};


// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// --- DOM Element Selection ---
// Login View Elements
const loginView = document.getElementById('loginView');
const adminEmailInput = document.getElementById('adminEmail');
const adminPasswordInput = document.getElementById('adminPassword');
const adminLoginBtn = document.getElementById('adminLoginBtn');
const adminErrorP = document.getElementById('adminError');

// Dashboard View Elements
const dashboardView = document.getElementById('dashboardView');
const adminUserEmailSpan = document.getElementById('adminUserEmail');
const adminLogoutBtn = document.getElementById('adminLogoutBtn');
const addBusForm = document.getElementById('addBusForm');
const formStatus = document.getElementById('formStatus');


// --- Authentication Logic ---

// This function checks if a user is already logged in or not
auth.onAuthStateChanged(user => {
    if (user) {
        // If user is logged in, hide the login form and show the dashboard
        loginView.style.display = 'none';
        dashboardView.style.display = 'block';
        adminUserEmailSpan.textContent = user.email;
    } else {
        // If user is not logged in, show the login form and hide the dashboard
        loginView.style.display = 'block';
        dashboardView.style.display = 'none';
    }
});

// Event listener for the Login Button
adminLoginBtn.addEventListener('click', () => {
    const email = adminEmailInput.value;
    const password = adminPasswordInput.value;
    adminErrorP.textContent = ''; // Clear previous errors

    auth.signInWithEmailAndPassword(email, password)
        .catch(error => {
            // If login fails, show an error message
            console.error("Login Error:", error);
            adminErrorP.textContent = error.message;
        });
});

// Event listener for the Logout Button
adminLogoutBtn.addEventListener('click', () => {
    auth.signOut();
});


// --- Firestore Logic (Adding a Bus) ---

// Event listener for the form submission
addBusForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevents the page from reloading
    formStatus.textContent = 'Adding bus...';
    formStatus.style.color = '#333';

    // Create an ordered array of all stops for the route
    const routeArray = [
        addBusForm.source.value.trim(),
        addBusForm.stop1.value.trim(),
        addBusForm.stop2.value.trim(),
        addBusForm.stop3.value.trim(),
        addBusForm.destination.value.trim()
    ];

    // Add the new bus data to the 'buses' collection in Firestore
    db.collection('buses').add({
        busType: addBusForm.newBusType.value,
        busName: addBusForm.busName.value,
        busNumber: addBusForm.busNumber.value,
        driverId: addBusForm.driverId.value, // This is the UID from Firebase Auth
        route: routeArray
    }).then(() => {
        formStatus.textContent = 'Bus added successfully!';
        formStatus.style.color = 'green';
        addBusForm.reset(); // Clear the form fields
        setTimeout(() => formStatus.textContent = '', 4000); // Hide message after 4 seconds
    }).catch(error => {
        formStatus.textContent = `Error: ${error.message}`;
        formStatus.style.color = 'red';
        console.error("Error adding bus: ", error);
    });
});
