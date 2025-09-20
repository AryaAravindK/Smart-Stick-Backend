const express = require("express");
const router = express.Router();
const { register, login, test } = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.get("/test", test);

module.exports = router;
