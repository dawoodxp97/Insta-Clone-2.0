const express = require("express");
const {
  registerUser,
  authUser,
  followUser,
  unFollowUser,
  editProfile,
  getAllUsers,
  getUser,
  getFav,
} = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/:id").get(getUser);
router.route("/fav/:id").get(protect, getFav);
router.post("/register", registerUser);
router.post("/login", authUser);
router
  .route("/")
  .get(protect, getAllUsers)
  .post(protect, followUser)
  .put(protect, editProfile)
  .delete(protect, unFollowUser);

module.exports = router;
