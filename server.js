const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = 3000;

app.use(express.json());

const MONGO_URL = process.env.MONGO_URL;

let dbReady = false;

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("MongoDB connected");
    dbReady = true;
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
  });

const userSchema = new mongoose.Schema({
  name: String,
  message: String
});

const User = mongoose.model("User", userSchema);

// Frontend
app.get("/", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>This Kubernetes Demo </title>

  <style>
    body {
      font-family: Arial, sans-serif;
      background: #f4f6f8;
      margin: 0;
      padding: 40px;
      color: #222;
    }

    .container {
      max-width: 700px;
      margin: auto;
    }

    h1 {
      text-align: center;
      color: #2563eb;
      margin-bottom: 5px;
    }

    .subtitle {
      text-align: center;
      color: #666;
      margin-bottom: 30px;
    }

    .card {
      background: white;
      padding: 25px;
      border-radius: 10px;
      box-shadow: 0 3px 12px rgba(0,0,0,0.08);
      margin-bottom: 20px;
    }

    h2 {
      margin-top: 0;
      font-size: 20px;
    }

    input {
      width: 100%;
      padding: 12px;
      margin: 8px 0 15px;
      border: 1px solid #ccc;
      border-radius: 6px;
      box-sizing: border-box;
      font-size: 14px;
    }

    button {
      width: 100%;
      padding: 12px;
      border: none;
      border-radius: 6px;
      background: #2563eb;
      color: white;
      font-size: 15px;
      cursor: pointer;
    }

    button:hover {
      background: #1d4ed8;
    }

    .data {
      border-bottom: 1px solid #eee;
      padding: 12px 0;
    }

    .data:last-child {
      border-bottom: none;
    }

    .name {
      font-weight: bold;
      color: #2563eb;
    }

    .message {
      color: #555;
      margin-top: 4px;
    }

    .empty {
      color: #888;
      text-align: center;
      padding: 15px;
    }

    .status {
      text-align: center;
      margin-top: 20px;
      color: #16a34a;
      font-size: 14px;
    }
  </style>
</head>

<body>

<div class="container">

  <h1>🚀 Hii this is my cicd Demo for K8s</h1>

  <div class="subtitle">
    Node.js + MongoDB running on Kubernetes
  </div>

  <div class="card">

    <h2>Add Data</h2>

    <input
      id="name"
      type="text"
      placeholder="Enter your name"
    >

    <input
      id="message"
      type="text"
      placeholder="Enter your message"
    >

    <button onclick="saveData()">
      Save
    </button>

  </div>


  <div class="card">

    <h2>MongoDB Data</h2>

    <div id="data">
      Loading...
    </div>

  </div>


  <div class="status">
    ● Backend Connected
  </div>

</div>


<script>

async function saveData() {

  const name =
    document.getElementById("name").value.trim();

  const message =
    document.getElementById("message").value.trim();

  if (!name || !message) {
    alert("Please enter name and message");
    return;
  }

  try {

    const response = await fetch("/api/users", {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        name: name,
        message: message
      })

    });

    if (!response.ok) {
      throw new Error("Failed to save");
    }

    document.getElementById("name").value = "";
    document.getElementById("message").value = "";

    loadData();

  } catch (error) {

    alert("Failed to save data");

  }

}


async function loadData() {

  const container =
    document.getElementById("data");

  try {

    const response =
      await fetch("/api/users");

    const users =
      await response.json();

    if (users.length === 0) {

      container.innerHTML =
        '<div class="empty">No data yet</div>';

      return;

    }

    container.innerHTML = "";

    users.slice().reverse().forEach(function(user) {

      const div =
        document.createElement("div");

      div.className = "data";

      div.innerHTML =
        '<div class="name">' +
        escapeHtml(user.name) +
        '</div>' +
        '<div class="message">' +
        escapeHtml(user.message) +
        '</div>';

      container.appendChild(div);

    });

  } catch (error) {

    container.innerHTML =
      '<div class="empty">Unable to load data</div>';

  }

}


function escapeHtml(value) {

  const div =
    document.createElement("div");

  div.textContent = value;

  return div.innerHTML;

}


loadData();

</script>

</body>
</html>
  `);
});

// Save data
app.post("/api/users", async (req, res) => {
  const user = await User.create({
    name: req.body.name,
    message: req.body.message
  });

  res.json(user);
});

// Get data
app.get("/api/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// Liveness
app.get("/healthz", (req, res) => {
  res.status(200).json({ status: "alive" });
});

// Readiness
app.get("/readyz", (req, res) => {
  if (dbReady) {
    return res.status(200).json({
      status: "ready",
      database: "connected"
    });
  }

  res.status(503).json({
    status: "not ready",
    database: "disconnected"
  });
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});