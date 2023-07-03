// server/status.js
const express = require('express');
const router = express.Router();

router.get('/status', (req, res) => {
  res.end('Server is running');
});

module.exports = router;
