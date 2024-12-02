const express = require("express");
const fs = require("fs");
const router = express.Router();

//  A helper function to read & write data
const readCategoriesData = () =>
  JSON.parse(fs.readFileSync("./data/categories.json", "utf8"));

// Gets all categories
router.get("/", (req, res) => {
  const categories = readCategoriesData();
  res.json(categories);
});

module.exports = router;
