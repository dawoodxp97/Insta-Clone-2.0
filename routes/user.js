const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middlewares/requireLogin");
const Post = mongoose.model("Post");
const User = mongoose.model("User");

router.get("/allusers", requireLogin, (req, res) => {
  User.find()
    .then((data) => {
      res.json({ data });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/user/:id", (req, res) => {
  User.findOne({ _id: req.params.id })
    .select("-password")
    .then((user) => {
      Post.find({ postedBy: req.params.id })
        .populate("postedBy", "_id name")
        .exec((err, posts) => {
          if (err) {
            return res.status(422).json({ error: err });
          }
          res.json({ user, posts });
        });
    })
    .catch((err) => {
      return res.status(404).json({ error: "User not Found" });
    });
});

router.get("/currUser", requireLogin, (req, res) => {
  User.findOne({ _id: req.user._id })
    .select("-password")
    .then((user) => {
      res.json({ user });
    })
    .catch((err) => {
      return res.status(404).json({ error: "User Not Found" });
    });
});

router.put("/addfav", requireLogin, (req, res) => {
  Post.findOne({ _id: req.body.postID })
    .populate("postedBy", "_id name userName pic")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      }

      User.findOneAndUpdate(
        { _id: req.user._id },
        {
          $push: { favorites: result },
        },
        {
          new: true,
        }
      )
        .select("-password")
        .then((data) => {
          res.json(data);
        })
        .catch((err) => {
          return res.status(422).json({ error: err });
        });
    });
});

router.put("/deletefav", requireLogin, (req, res) => {
  Post.findOne({ _id: req.body.postID })
    .populate("postedBy", "_id name userName pic")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      }

      User.findOneAndUpdate(
        { _id: req.user._id },
        {
          $pull: { favorites: result },
        },
        {
          new: true,
        }
      )
        .select("-password")
        .then((data) => {
          res.json(data);
        })
        .catch((err) => {
          return res.status(422).json({ error: err });
        });
    });
});

router.put("/follow", requireLogin, (req, res) => {
  User.findByIdAndUpdate(
    req.body.followID,
    {
      $push: { followers: req.user._id },
    },
    {
      new: true,
    },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      }
      User.findByIdAndUpdate(
        req.user._id,
        {
          $push: { following: req.body.followID },
        },
        {
          new: true,
        }
      )
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          return res.status(422).json({ error: err });
        });
    }
  );
});

router.put("/unfollow", requireLogin, (req, res) => {
  User.findByIdAndUpdate(
    req.body.unfollowID,
    {
      $pull: { followers: req.user._id },
    },
    {
      new: true,
    },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      }
      User.findByIdAndUpdate(
        req.user._id,
        {
          $pull: { following: req.body.unfollowID },
        },
        {
          new: true,
        }
      )
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          return res.status(422).json({ error: err });
        });
    }
  );
});

router.put("/updatepic", requireLogin, (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { $set: { pic: req.body.pic } },
    { new: true },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: "Unable to update Pic" });
      }
      res.json({ result: result });
    }
  );
});

module.exports = router;
