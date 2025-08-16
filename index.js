// Import modules
const express = require("express");
const path = require("path");
const { v4: uuid } = require("uuid");
const admin = require("firebase-admin");

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//  FIREBASE SETUP

let serviceAccount;

if (process.env.SERVICE_ACCOUNT) {
  // Render ya server pe
  serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT);
} else {
  // Local testing ke liye file use karo
  serviceAccount = require("./serviceAccountKey.json");
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});


const db = admin.firestore();

// ROUTES

// Example Firebase test route
app.get("/add", async (req, res) => {
  await db.collection("users").add({ name: "Gagan" });
  res.send("User added in Firebase!");
});

// 🏠 Home page -> ab Firebase se data fetch karke show karenge
app.get("/", async (req, res) => {
  try {
    let data = {
      announcements: [],
      events: [],
      market: [],
      contacts: [],
    };

    // Har collection se data fetch
    for (let type of Object.keys(data)) {
      const snapshot = await db.collection(type).get();
      snapshot.forEach((doc) => {
        data[type].push({ id: doc.data().id, ...doc.data() }); // ← yaha id humari custom wali
      });
    }

    res.render("home", { data });
  } catch (err) {
    console.error("Error fetching data:", err);
    res.send("Error loading data from Firebase");
  }
});

// Show form
app.get("/add/:type", (req, res) => {
  const { type } = req.params;
  res.render("form", { type });
});

// Handle form submission (save in Firebase)
app.post("/add/:type", async (req, res) => {
  const { type } = req.params;
  const { content } = req.body;

  const newItem = {
    id: uuid(), // custom id for delete
    content,
  };

  await db.collection(type).add(newItem);

  res.redirect("/");
});

// Delete entry (from Firebase by custom id)
app.post("/delete/:type/:id", async (req, res) => {
  const { type, id } = req.params;

  try {
    const snapshot = await db.collection(type).where("id", "==", id).get();

    snapshot.forEach(async (doc) => {
      await db.collection(type).doc(doc.id).delete();
    });

    res.redirect("/");
  } catch (err) {
    console.error("Error deleting item:", err);
    res.status(500).send("Error deleting item");
  }
});

// START SERVER 
app.listen(PORT, () => {
  console.log(`Server running on port${PORT}`);
});


