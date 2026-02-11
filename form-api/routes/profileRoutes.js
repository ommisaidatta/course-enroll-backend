const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const {
  getMyProfile,
  updateMyProfile,
} = require("../controllers/profileController");

router.get("/profile", auth, getMyProfile);
router.put("/profile", auth, updateMyProfile);

module.exports = router;
