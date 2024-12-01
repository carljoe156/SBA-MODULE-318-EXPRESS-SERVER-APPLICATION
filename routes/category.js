const express = require("express");
const router = express.Router();

// Tells us which routes
router.get("/", (req, res) => {
  res.render("category", { title: "Category" });
});

// For exporting the router
module.exports = router;
