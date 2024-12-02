const express = require("express");
const fs = require("fs");
const router = express.Router();
const validateBookInput = require("../middlewares/validateBookInput");

// a A helper function to read & write data
const readBooksData = () =>
  JSON.parse(fs.readFileSync("./data/books.json", "utf8"));
const writeBooksData = (data) =>
  fs.writeFileSync("./data/books.json", JSON.stringify(data, null, 2));

// Gets all books
router.get("/", (req, res) => {
  const books = readBooksData();
  res.render("home", { books });
});

// Updates a book to book-list
router.patch("/:id", (req, res) => {
  const bookId = req.params.id;
  const updatedBook = req.body;
  const books = readBooksData();
  const bookIndex = books.findIndex((b) => b.id === parseInt(bookId));

  if (bookIndex !== -1) {
    books[bookIndex] = { ...books[bookIndex], ...updatedBook };
    writeBooksData(books);
    res.json(books[bookIndex]);
  } else {
    res.status(404).send("Book not found.");
  }
});

// For Deleting a book form the book-list
router.delete("/:id", (req, res) => {
  const bookId = req.params.id;
  let books = readBooksData();
  books = books.filter((b) => b.id !== parseInt(bookId));

  if (books.length < readBooksData().length) {
    writeBooksData(books);
    res.status(204).send();
  } else {
    res.status(404).send("Book not found.");
  }
});

module.exports = router;