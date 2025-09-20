const express = require("express");
const router = express.Router();
const { addDevice } = require("../controllers/devicesController");
const auth = require("../middleware/authMiddleware");

router.post("/add", auth, addDevice);

module.exports = router;
