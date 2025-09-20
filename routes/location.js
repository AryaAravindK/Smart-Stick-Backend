const express = require("express");
const router = express.Router();
const { addLocation } = require("../controllers/locationController");
const auth = require("../middleware/authMiddleware");

router.post("/add", auth, addLocation);

module.exports = router;
