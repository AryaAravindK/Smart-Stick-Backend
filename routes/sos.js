// routes/sos.js
const express = require('express');
const router = express.Router();
const { sendSOS } = require('../controllers/sosController');

router.post('/', sendSOS);

module.exports = router;
