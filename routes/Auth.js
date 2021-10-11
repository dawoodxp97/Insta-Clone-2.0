const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = mongoose.model("User");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/keys");
const requireLogin = require("../middlewares/requireLogin");

router.get("/protected", requireLogin, (req, res) => {
  res.send("Hey User");
});

router.post("/signup", (req, res) => {
  const { name, userName, email, password, pic } = req.body;
  if (!name || !userName || !email || !password) {
    return res.status(422).json({ error: "Please add all the fields" });
  }
  // Checking for duplication of account
  User.findOne({ email: email })
    .then((savedUser) => {
      if (savedUser) {
        return res
          .status(422)
          .json({ error: "User already exists with that email." });
      }
      bcrypt.hash(password, 15).then((hashedPassword) => {
        const user = new User({
          name,
          userName,
          email,
          password: hashedPassword,
          pic,
        });
        user
          .save()
          .then((user) => res.json({ message: "Account Created Successfully" }))
          .catch((err) => res.json({ err }));
      });
    })
    .catch((err) => res.json({ err }));
});

router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: "Please Add Email or Password" });
  }
  User.findOne({ email: email })
    .then((savedUser) => {
      if (!savedUser) {
        return res.status(422).json({ error: "Invalid Email or Password" });
      }
      bcrypt
        .compare(password, savedUser.password)
        .then((doMatch) => {
          if (doMatch) {
            //   res.json({ message: "Signed In Successfully" });
            const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
            const { _id, name, userName, email, followers, following, pic } =
              savedUser;
            res.json({
              token,
              user: { _id, name, userName, email, followers, following, pic },
            });
          } else {
            return res.status(422).json({ error: "Invalid Email or Password" });
          }
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
});
module.exports = router;
