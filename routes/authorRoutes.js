const express = require("express");
const fs = require("fs");
const router = express.Router();

//  our helper function to read & write data
const readAuthorsData = () =>
  JSON.parse(fs.readFileSync("./data/authors.json", "utf8"));

// Gets all authors
router.get("/", (req, res) => {
  const authors = readAuthorsData();
  res.json(authors);
});

module.exports = router;
