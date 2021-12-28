// Importing
const express = require("express");
const path = require("path");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");

// Cofig
connectDB();
const app = express();
const PORT = process.env.PORT;

// Middlewares
app.use(express.json());
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
// app.use(notFound);
app.use(errorHandler);

// --------------------------deployment------------------------------

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}

// Listen
const server = app.listen(
  PORT,
  console.log(`Server running on PORT ${PORT}...`)
);
