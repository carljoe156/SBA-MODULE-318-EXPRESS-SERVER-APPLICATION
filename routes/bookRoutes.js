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

router.get("/edit/:id", (req, res) => {
  const bookId = parseInt(req.params.id);
  const books = readBooksData();
  const book = books.find((b) => b.id === bookId);

  if (book) {
    res.render("editBook", { book });
  } else {
    res.status(404).send("Book not found.");
  }
});

router.patch("/edit/:id:", (req, res) => {
  const bookId = parseInt(req.params.id);
  const { bookName, bookAuthor, bookPrice } = req.body;

  const books = readBooksData();
  const bookIndex = books.findIndex((b) => b.id === bookId);

  if (bookIndex !== -1) {
    // Update the book's details
    books[bookIndex] = { id: bookId, bookName, bookAuthor, bookPrice };
    writeBooksData(books);
    res.redirect("/books");
  } else {
    res.status(404).send("Book not found.");
  }
});

// Updates a book to book-list
router.patch("/:id", validateBookInput, (req, res) => {
  const bookId = parseInt(req.params.id);
  const updatedBook = req.body;
  const books = readBooksData();
  const bookIndex = books.findIndex((b) => b.id === bookId);

  if (bookIndex !== -1) {
    books[bookIndex] = { ...books[bookIndex], ...updatedBook };
    writeBooksData(books);
    res.json(books[bookIndex]);
  } else {
    res.status(404).send("Book not found.");
  }
});

// For Deleting a book form the book-list
router.delete("/delete/:id", (req, res) => {
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
