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
      <title>Kubernetes Demo</title>
      <style>
        body {
          font-family: Arial;
          max-width: 700px;
          margin: 50px auto;
          padding: 20px;
        }
        input, button {
          padding: 10px;
          margin: 5px 0;
          width: 100%;
          box-sizing: border-box;
        }
        button {
          cursor: pointer;
        }
        .card {
          padding: 15px;
          margin-top: 10px;
          border: 1px solid #ddd;
        }
      </style>
    </head>

    <body>
      <h1>🚀 Kubernetes Demo</h1>

      <p>Node.js + MongoDB running on Kubernetes</p>

      <input id="name" placeholder="Your name">
      <input id="message" placeholder="Your message">

      <button onclick="saveData()">Save</button>

      <h2>Saved Data</h2>

      <div id="data"></div>

      <script>
        async function saveData() {
          const name = document.getElementById("name").value;
          const message = document.getElementById("message").value;

          await fetch("/api/users", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, message })
          });

          loadData();
        }

        async function loadData() {
          const response = await fetch("/api/users");
          const users = await response.json();

          document.getElementById("data").innerHTML =
            users.map(user =>
              "<div class='card'><b>" +
              user.name +
              "</b><br>" +
              user.message +
              "</div>"
            ).join("");
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