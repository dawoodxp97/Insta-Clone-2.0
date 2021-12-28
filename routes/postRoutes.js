const express = require("express");
const {
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
} = require("../controllers/postControllers");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/").get(getAllPosts).post(protect, createPost);
router
  .route("/:postId")
  .get(protect, getPost)
  .post(protect, likePost)
  .put(protect, unLikePost)
  .delete(protect, deletePost);
router.route("/fav/:id").post(protect, addFav).put(protect, removeFav);
router
  .route("/:postId/:cID")
  .post(protect, comment)
  .put(protect, editComment)
  .delete(protect, uncomment);

module.exports = router;
