const express = require("express");
const router = express.Router();

// Tells us which routes
router.get("/", (req, res) => {
  res.render("books", { title: "Books" });
});

// For exporting the router
module.exports = router;
