// Importing
const express = require("express");
const mongoose = require("mongoose");
const { MONGOURI } = require("./config/keys");
require("./models/User");
require("./models/Post");

// App Cofig
const app = express();
const PORT = process.env.PORT || 5000;

//  DB Config
mongoose.connect(MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("connected", () => {
  console.log("Connected to Mongo!!!!");
});
mongoose.connection.on("error", (err) => {
  console.log("Error in connecting to Mongo!!!!", err);
});

// Middlewares
app.use(express.json());
app.use(require("./routes/Auth"));
app.use(require("./routes/post"));
app.use(require("./routes/user"));

if (process.env.NODE_ENV == "production") {
  app.use(express.static("client/build"));
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

// Api Routes
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Listen
app.listen(PORT, () => {
  console.log("Server is Running at", PORT);
});
