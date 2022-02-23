const asyncHandler = require("express-async-handler");
const generateToken = require("../config/generateToken");
const Post = require("../models/postModel");
const User = require("../models/userModel");

//@description     Register new user
//@route           POST /api/user/
//@access          Public

const registerUser = asyncHandler(async (req, res) => {
  const { name, userName, email, password, pic } = req.body;

  if (!name || !userName || !email || !password) {
    res.status(400);
    throw new Error("Please Enter all the Feilds");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }
  const user = await User.create({
    name,
    email,
    pic,
    userName,
    password,
  });
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      userName: user.userName,
      email: user.email,
      pic: user.pic,
    });
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});

//@description     Auth the user
//@route           POST /api/user/login
//@access          Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
      },
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});

//@description     Follow the user
//@route           POST /api/user
//@access          Protected
const followUser = asyncHandler(async (req, res) => {
  try {
    const followedUser = await User.findByIdAndUpdate(
      req.body.followID,
      {
        $push: { followers: req.user._id },
      },
      {
        new: true,
      }
    );
    const followingUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $push: { following: req.body.followID },
      },
      {
        new: true,
      }
    );
    res.json({
      followers: followedUser.followers,
      following: followingUser.following,
    });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     unFollow the user
//@route           DELETE /api/user
//@access          Protected
const unFollowUser = asyncHandler(async (req, res) => {
  try {
    const unFollowedUser = await User.findByIdAndUpdate(
      req.body.followID,
      {
        $pull: { followers: req.user._id },
      },
      {
        new: true,
      }
    );
    const unFollowingUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $pull: { following: req.body.followID },
      },
      {
        new: true,
      }
    );
    res.json({
      followers: unFollowedUser.followers,
      following: unFollowingUser.following,
    });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     editProfilePic the user
//@route           PUT /api/user
//@access          Protected
const editProfile = asyncHandler(async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { pic: req.body.pic } },
      { new: true }
    )
      .select("-password")
      .populate("favorites");
    res.json(user);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Get All users
//@route           GET /api/user
//@access          Protected
const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json({ users });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Get a user
//@route           GET /api/user/:id
//@access          Public
const getUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id })
      .select("-password")
      .populate("favorites.postedBy", "_id name userName pic")
      .populate("favorites.comments.postedBy", "_id name");
    const userPosts = await Post.find({ postedBy: req.params.id }).populate(
      "postedBy",
      "_id name"
    );
    res.json({ user, userPosts });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Get Fav of a user
//@route           GET /api/user/fav
//@access          Protected
const getFav = asyncHandler(async (req, res) => {
  try {
    const userFavs = await User.findOne({ _id: req.user._id }).populate(
      "favorites.postedBy",
      "_id name userName pic"
    );
    res.json(userFavs.favorites);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
module.exports = {
  registerUser,
  authUser,
  followUser,
  unFollowUser,
  editProfile,
  getAllUsers,
  getUser,
  getFav,
};
