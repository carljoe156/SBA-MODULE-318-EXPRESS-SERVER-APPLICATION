const express = require("express");
const router = express.Router();

// This is the Authors Route via method GET/authors
router.get("/", (req, res) => {
  res.render("reviews", { title: "Reviews" });
});

module.exports = router;
