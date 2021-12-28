const asyncHandler = require("express-async-handler");
const Post = require("../models/postModel");
const User = require("../models/userModel");

//@description     Get all Posts
//@route           GET /api/post/
//@access          Public
const getAllPosts = asyncHandler(async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("postedBy", "_id name userName pic")
      .populate("comments.postedBy", "_id name ")
      .sort("-createdAt");
    res.json({ posts });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Get a Post
//@route           GET /api/post/:postId
//@access          Protected
const getPost = asyncHandler(async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.postId })
      .populate("postedBy", "_id name userName pic")
      .populate("comments.postedBy", "_id name");
    res.json(post);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
//@description     Create Post
//@route           POST /api/post/
//@access          Protected
const createPost = asyncHandler(async (req, res) => {
  const { message, photo } = req.body;
  if (!message || !photo) {
    return res.sendStatus(422).json({ error: "Please add all the Fields" });
  }
  var newPost = {
    message,
    photo,
    postedBy: req.user,
  };
  try {
    var post = await Post.create(newPost);
    res.json({ post });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Like a Post
//@route           POST /api/post/:postId
//@access          Protected
const likePost = asyncHandler(async (req, res) => {
  try {
    const likedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $push: { likes: req.user._id },
      },
      {
        new: true,
      }
    );
    res.json(likedPost.likes);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Unlike a Post
//@route           PUT /api/post/:postId
//@access          Protected
const unLikePost = asyncHandler(async (req, res) => {
  try {
    const unlike = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $pull: { likes: req.user._id },
      },
      {
        new: true,
      }
    );
    const unlikedPost = await Post.findOne({ _id: req.params.postId });
    res.json(unlikedPost.likes);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Comment a Post
//@route           POST /api/post/:postId/:cID
//@access          Protected
const comment = asyncHandler(async (req, res) => {
  const comment = {
    text: req.body.text,
    postedBy: req.user._id,
  };
  try {
    const commentedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $push: { comments: comment },
      },
      {
        new: true,
      }
    ).populate("comments.postedBy", "_id name");
    res.json(commentedPost);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     uncomment a Post
//@route           DELETE /api/post/:postId/:cID
//@access          Protected
const uncomment = asyncHandler(async (req, res) => {
  try {
    const uncommentedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $pull: { comments: { _id: req.params.cID } },
      },
      {
        new: true,
      }
    ).populate("comments.postedBy", "_id name");
    res.json(uncommentedPost);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Edit a Comment
//@route           PUT /api/post/:postId/:cID
//@access          Protected
const editComment = (req, res) => {
  Post.updateOne(
    { _id: req.params.postId, "comments._id": req.params.cID },
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
};

//@description     Delete a Post
//@route           DELETE /api/post/:postId
//@access          Protected
const deletePost = asyncHandler(async (req, res) => {
  try {
    const result = await Post.findByIdAndDelete({ _id: req.params.postId });
    res.json(result);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Add Fav to user
//@route           POST /api/post/:id
//@access          Protected

const addFav = asyncHandler(async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id })
      .populate("postedBy", "_id name userName pic")
      .populate("comments.postedBy", "_id name");
    const user = await User.findOneAndUpdate(
      { _id: req.user._id },
      {
        $push: { favorites: post },
      },
      {
        new: true,
      }
    )
      .select("-password")
      .populate("favorites.postedBy", "_id name userName pic");
    res.json(user.favorites);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Remove Fav from user
//@route           PUT /api/post/fav/:id
//@access          Protected
const removeFav = asyncHandler(async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id })
      .populate("postedBy", "_id name userName pic")
      .populate("comments.postedBy", "_id name");
    const user = await User.findOneAndUpdate(
      { _id: req.user._id },
      {
        $pull: { favorites: post },
      },
      {
        new: true,
      }
    ).select("-password");
    res.json(user.favorites);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = {
  getAllPosts,
  createPost,
  likePost,
  unLikePost,
  comment,
  uncomment,
  editComment,
  deletePost,
  getPost,
  addFav,
  removeFav,
};
