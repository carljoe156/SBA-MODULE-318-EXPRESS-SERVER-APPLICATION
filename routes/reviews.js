const express = require("express");
const router = express.Router();

// Tells us which routes
router.get("/", (req, res) => {
  res.send("Reviews route");
});

// For exports the router
module.exports = router;
