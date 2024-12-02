const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// This function helps to read data from a file (books.json)
function readDataFile(filePath) {
  const data = fs.readFileSync(filePath, "utf8");
  return JSON.parse(data);
}

// This function to write data to a file (books.json)
function writeDataFile(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Route to get all reviews (books with reviews)
router.get("/", (req, res) => {
  const books = readDataFile(path.join(__dirname, "../data/books.json"));

  // Filter books that have reviews
  const booksWithReviews = books.filter(
    (book) => book.reviews && book.reviews.length > 0
  );

  // Return books with reviews as JSON
  res.json(booksWithReviews);
});

// Route to get a specific book with its reviews by ID
router.get("/:id", (req, res) => {
  const bookId = req.params.id;
  const books = readDataFile(path.join(__dirname, "../data/books.json"));

  // Find the specific book by its ID
  const book = books.find((book) => book.id == bookId);

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Return the book with reviews
  res.json(book);
});

// Using POST route to add a review to a specific book by ID
router.post("/:id", (req, res) => {
  const bookId = req.params.id;
  const { reviewerName, rating, comment } = req.body;

  const books = readDataFile(path.join(__dirname, "../data/books.json"));

  // Find the specific book by its ID
  const book = books.find((book) => book.id == bookId);
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Create a new review object
  const newReview = {
    id: book.reviews.length + 1, // Assign ID based on the number of existing reviews
    reviewerName,
    rating: Number(rating), // Ensure rating is a number
    comment,
  };

  // Add the review to the book's reviews array
  if (!book.reviews) {
    book.reviews = [];
  }
  book.reviews.push(newReview);

  // Save the updated books list to books.json
  writeDataFile(path.join(__dirname, "../data/books.json"), books);

  // Return the newly added review
  res.status(201).json(newReview);
});

// Using PUT route to update a specific review for a book by review ID
router.put("/:id/review/:reviewId", (req, res) => {
  const { id, reviewId } = req.params;
  const { reviewerName, rating, comment } = req.body;

  const books = readDataFile(path.join(__dirname, "../data/books.json"));

  // Find the book by ID
  const book = books.find((book) => book.id == id);
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Find the review by its ID
  const review = book.reviews.find((review) => review.id == reviewId);
  if (!review) {
    return res.status(404).json({ message: "Review not found" });
  }

  // Update the review
  review.reviewerName = reviewerName || review.reviewerName;
  review.rating = rating || review.rating;
  review.comment = comment || review.comment;

  // Save the updated book list to books.json
  writeDataFile(path.join(__dirname, "../data/books.json"), books);

  // Return the updated review
  res.json(review);
});

// Using DELETE route to remove a specific review by review ID
router.delete("/:id/review/:reviewId", (req, res) => {
  const { id, reviewId } = req.params;

  const books = readDataFile(path.join(__dirname, "../data/books.json"));

  // Find the book by ID
  const book = books.find((book) => book.id == id);
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Find the review index by its ID
  const reviewIndex = book.reviews.findIndex((review) => review.id == reviewId);

  if (reviewIndex === -1) {
    return res.status(404).json({ message: "Review not found" });
  }

  // Remove the review
  book.reviews.splice(reviewIndex, 1);

  // Save the updated book list to books.json
  writeDataFile(path.join(__dirname, "../data/books.json"), books);

  // Return a success message
  res.json({ message: "Review deleted successfully" });
});

module.exports = router;
