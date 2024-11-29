const express = require("express");
const router = express.Router();

// Tells us which routes
router.get("/", (req, res) => {
  res.send("Books route");
});

// For exporting the router
module.exports = router;