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
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>Kubernetes Demo</title>

  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: Inter, Arial, sans-serif;
      min-height: 100vh;
      background:
        radial-gradient(circle at top left, #243b70 0%, transparent 35%),
        radial-gradient(circle at bottom right, #123d46 0%, transparent 35%),
        #0b1020;
      color: #f8fafc;
      padding: 40px 20px;
    }

    .container {
      max-width: 1000px;
      margin: auto;
    }

    /* Header */

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 35px;
      gap: 20px;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .logo {
      width: 52px;
      height: 52px;
      border-radius: 15px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #38bdf8, #6366f1);
      font-size: 25px;
      box-shadow: 0 10px 35px rgba(59, 130, 246, 0.35);
    }

    .brand h1 {
      font-size: 25px;
      letter-spacing: -0.5px;
    }

    .brand p {
      color: #94a3b8;
      margin-top: 4px;
      font-size: 14px;
    }

    .status {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(34, 197, 94, 0.1);
      border: 1px solid rgba(34, 197, 94, 0.25);
      padding: 9px 14px;
      border-radius: 999px;
      color: #86efac;
      font-size: 13px;
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #22c55e;
      box-shadow: 0 0 10px #22c55e;
    }

    /* Hero */

    .hero {
      background: rgba(15, 23, 42, 0.72);
      border: 1px solid rgba(148, 163, 184, 0.14);
      border-radius: 24px;
      padding: 35px;
      backdrop-filter: blur(18px);
      box-shadow: 0 25px 80px rgba(0, 0, 0, 0.25);
      margin-bottom: 25px;
    }

    .hero h2 {
      font-size: 32px;
      margin-bottom: 10px;
      letter-spacing: -1px;
    }

    .hero h2 span {
      color: #38bdf8;
    }

    .hero p {
      color: #94a3b8;
      line-height: 1.6;
      max-width: 700px;
    }

    /* Grid */

    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 25px;
    }

    .card {
      background: rgba(15, 23, 42, 0.72);
      border: 1px solid rgba(148, 163, 184, 0.14);
      border-radius: 22px;
      padding: 28px;
      backdrop-filter: blur(18px);
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
    }

    .card h3 {
      font-size: 18px;
      margin-bottom: 20px;
    }

    /* Form */

    .input-group {
      margin-bottom: 16px;
    }

    label {
      display: block;
      color: #cbd5e1;
      font-size: 13px;
      margin-bottom: 7px;
    }

    input {
      width: 100%;
      padding: 13px 15px;
      border-radius: 12px;
      border: 1px solid #334155;
      background: rgba(15, 23, 42, 0.8);
      color: white;
      outline: none;
      font-size: 14px;
      transition: 0.2s;
    }

    input:focus {
      border-color: #38bdf8;
      box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.12);
    }

    button {
      width: 100%;
      border: none;
      border-radius: 12px;
      padding: 13px;
      background: linear-gradient(135deg, #38bdf8, #6366f1);
      color: white;
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
      transition: 0.2s;
      margin-top: 5px;
    }

    button:hover {
      transform: translateY(-1px);
      box-shadow: 0 10px 25px rgba(56, 189, 248, 0.2);
    }

    button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    /* Data */

    .data-list {
      max-height: 350px;
      overflow-y: auto;
    }

    .data-item {
      border: 1px solid #1e293b;
      background: rgba(30, 41, 59, 0.45);
      border-radius: 14px;
      padding: 15px;
      margin-bottom: 12px;
    }

    .data-item:last-child {
      margin-bottom: 0;
    }

    .user-name {
      color: #38bdf8;
      font-weight: 600;
      margin-bottom: 5px;
    }

    .user-message {
      color: #cbd5e1;
      font-size: 14px;
    }

    .empty {
      color: #64748b;
      text-align: center;
      padding: 30px 10px;
      font-size: 14px;
    }

    /* Architecture */

    .architecture {
      margin-top: 25px;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
    }

    .arch-item {
      text-align: center;
      padding: 18px 10px;
      border-radius: 15px;
      background: rgba(30, 41, 59, 0.4);
      border: 1px solid #1e293b;
    }

    .arch-icon {
      font-size: 25px;
      margin-bottom: 8px;
    }

    .arch-item strong {
      display: block;
      font-size: 13px;
    }

    .arch-item span {
      color: #64748b;
      font-size: 11px;
    }

    /* Footer */

    .footer {
      text-align: center;
      color: #64748b;
      font-size: 12px;
      margin-top: 30px;
    }

    /* Toast */

    .toast {
      position: fixed;
      right: 25px;
      bottom: 25px;
      padding: 13px 18px;
      border-radius: 12px;
      background: #16a34a;
      color: white;
      font-size: 13px;
      transform: translateY(100px);
      opacity: 0;
      transition: 0.3s;
    }

    .toast.show {
      transform: translateY(0);
      opacity: 1;
    }

    @media (max-width: 750px) {
      .grid {
        grid-template-columns: 1fr;
      }

      .architecture {
        grid-template-columns: 1fr 1fr;
      }

      .header {
        align-items: flex-start;
        flex-direction: column;
      }

      .hero {
        padding: 25px;
      }
    }
  </style>
</head>

<body>

  <div class="container">

    <!-- Header -->

    <div class="header">

      <div class="brand">
        <div class="logo">☸</div>

        <div>
          <h1>Kubernetes Demo</h1>
          <p>Node.js • MongoDB • Kubernetes</p>
        </div>
      </div>

      <div class="status">
        <span class="status-dot"></span>
        Application Online
      </div>

    </div>


    <!-- Hero -->

    <div class="hero">

      <h2>
        Welcome to the <span>Kubernetes</span> Demo
      </h2>

      <p>
        This application demonstrates a Node.js backend running
        on Kubernetes with MongoDB persistence. Add your data below
        and watch it survive pod restarts.
      </p>

    </div>


    <!-- Main -->

    <div class="grid">

      <!-- Add Data -->

      <div class="card">

        <h3>➕ Add Data</h3>

        <div class="input-group">

          <label>Your Name</label>

          <input
            id="name"
            type="text"
            placeholder="Enter your name"
          >

        </div>

        <div class="input-group">

          <label>Message</label>

          <input
            id="message"
            type="text"
            placeholder="Enter a message"
          >

        </div>

        <button id="saveBtn" onclick="saveData()">
          Save to MongoDB
        </button>

      </div>


      <!-- Database Data -->

      <div class="card">

        <h3>🗄️ MongoDB Data</h3>

        <div id="data" class="data-list">

          <div class="empty">
            Loading data...
          </div>

        </div>

      </div>

    </div>


    <!-- Architecture -->

    <div class="card" style="margin-top:25px">

      <h3>⚙️ Application Architecture</h3>

      <div class="architecture">

        <div class="arch-item">
          <div class="arch-icon">🌐</div>
          <strong>Browser</strong>
          <span>User Interface</span>
        </div>

        <div class="arch-item">
          <div class="arch-icon">🚀</div>
          <strong>Node.js</strong>
          <span>Backend API</span>
        </div>

        <div class="arch-item">
          <div class="arch-icon">☸️</div>
          <strong>Kubernetes</strong>
          <span>Container Platform</span>
        </div>

        <div class="arch-item">
          <div class="arch-icon">🍃</div>
          <strong>MongoDB</strong>
          <span>Persistent Database</span>
        </div>

      </div>

    </div>


    <div class="footer">
      Kubernetes CI/CD Demo • Node.js + MongoDB
    </div>

  </div>


  <!-- Toast -->

  <div id="toast" class="toast">
    Data saved successfully!
  </div>


  <script>

    async function saveData() {

      const name =
        document.getElementById("name").value.trim();

      const message =
        document.getElementById("message").value.trim();

      const button =
        document.getElementById("saveBtn");


      if (!name || !message) {

        showToast(
          "Please enter both name and message.",
          true
        );

        return;
      }


      button.disabled = true;

      button.innerText = "Saving...";


      try {

        const response = await fetch("/api/users", {

          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            name,
            message
          })

        });


        if (!response.ok) {
          throw new Error("Failed to save data");
        }


        document.getElementById("name").value = "";
        document.getElementById("message").value = "";


        await loadData();


        showToast(
          "✓ Data saved to MongoDB"
        );

      }

      catch (error) {

        console.error(error);

        showToast(
          "Failed to save data",
          true
        );

      }

      finally {

        button.disabled = false;

        button.innerText = "Save to MongoDB";

      }

    }


    async function loadData() {

      const container =
        document.getElementById("data");


      try {

        const response =
          await fetch("/api/users");


        if (!response.ok) {
          throw new Error("Failed to load data");
        }


        const users =
          await response.json();


        if (!users.length) {

          container.innerHTML = `
            <div class="empty">
              No data yet.<br>
              Add your first message!
            </div>
          `;

          return;
        }


        container.innerHTML =
          users
            .reverse()
            .map(user => `

              <div class="data-item">

                <div class="user-name">
                  ${escapeHtml(user.name)}
                </div>

                <div class="user-message">
                  ${escapeHtml(user.message)}
                </div>

              </div>

            `)
            .join("");

      }

      catch (error) {

        console.error(error);

        container.innerHTML = `
          <div class="empty">
            Unable to connect to backend.
          </div>
        `;

      }

    }


    function escapeHtml(value) {

      const div =
        document.createElement("div");

      div.textContent = value;

      return div.innerHTML;

    }


    function showToast(message, error = false) {

      const toast =
        document.getElementById("toast");


      toast.innerText = message;

      toast.style.background =
        error ? "#dc2626" : "#16a34a";


      toast.classList.add("show");


      setTimeout(() => {

        toast.classList.remove("show");

      }, 2500);

    }


    // Load existing MongoDB data
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