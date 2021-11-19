const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middlewares/requireLogin");
const Post = mongoose.model("Post");

router.get("/allposts", (req, res) => {
  Post.find()
    .populate("postedBy", "_id name userName pic")
    .sort("-createdAt")
    .then((posts) => {
      res.json({ posts });
    })
    .catch((err) => console.log(err));
});

router.post("/createpost", requireLogin, (req, res) => {
  const { message, photo } = req.body;
  if (!message || !photo) {
    return res.status(422).json({ error: "Please add all the Fields" });
  }
  const post = new Post({
    message,
    photo,
    postedBy: req.user,
  });
  post
    .save()
    .then((result) => {
      res.json({ post: result });
    })
    .catch((err) => console.log(err));
});

router.get("/myposts", requireLogin, (req, res) => {
  Post.find({ postedBy: req.user._id })
    .populate("postedBy", "_id name userName")
    .then((mypost) => {
      res.json({ mypost });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.put("/like", requireLogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { likes: req.user._id },
    },
    {
      new: true,
    }
  ).exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      res.json(result);
    }
  });
});

router.put("/unlike", requireLogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: { likes: req.user._id },
    },
    {
      new: true,
    }
  ).exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      res.json(result);
    }
  });
});

router.put("/editComment", requireLogin, (req, res) => {
  Post.updateOne(
    { _id: req.body.postId, "comments._id": req.body.cID },
    { $set: { "comments.$.text": req.body.editText } },
    function (err, result) {
      if (err) {
        return res.status(500).send({
          message: err.message || "Some error occured while updating user",
        });
      }
      if (!result) {
        return res.status(404).send({
          message: "Message not found",
        });
      }

      return res.status(200).send(result);
    }
  );
});

router.put("/deleteComment", requireLogin, (req, res) => {
  Post.updateOne(
    { _id: req.body.postId },
    { $pull: { comments: { _id: req.body.cID } } },
    { upsert: false, multi: true },
    function (err, result) {
      if (err) {
        return res.status(500).send({
          message: err.message || "Some error occured while updating user",
        });
      }
      if (!result) {
        return res.status(404).send({
          message: "Message not found",
        });
      }

      return res.status(200).send(result);
    }
  );
});

router.put("/comment", requireLogin, (req, res) => {
  const comment = {
    text: req.body.text,
    c_name: req.user.name,
    postedBy: req.user._id,
  };
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { comments: comment },
    },
    {
      new: true,
    }
  )
    .populate("comments.postedBy", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        res.json(result);
      }
    });
});

router.delete("/deletepost/:postID", requireLogin, (req, res) => {
  Post.findOne({ _id: req.params.postID })
    .populate("postedBy", "_id")
    .exec((err, post) => {
      if (err || !post) {
        return res.status(422).json({ error: err });
      }
      if (post.postedBy._id.toString() === req.user._id.toString()) {
        post
          .remove()
          .then((result) => {
            res.json({ message: "Successfully Deleted" });
          })
          .catch((err) => {
            res.json({ error: err });
          });
      }
    });
});

module.exports = router;
