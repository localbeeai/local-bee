const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Orders route - coming soon' });
});

module.exports = router;