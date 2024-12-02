const express = require("express");
const port = 3000;
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");

// Middleware
const logger = require("./middlewares/logger");
const validateBookInput = require("./middlewares/validateBookInput");

// Routes
const bookRoutes = require("./routes/bookRoutes");
const authorRoutes = require("./routes/authorRoutes"); // Doesn't work, its apart of the Books route now
const categoryRoutes = require("./routes/categoryRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

let books = [];

// Sets the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// To Serve static files (CSS, images, etc.)
app.use(express.static(path.join(__dirname, "public")));

// To Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Our Custom middleware to log requests
app.use(logger); // Logs each request

// Routes
app.use("/books", bookRoutes);
app.use("/authors", authorRoutes); //remove this route, this is apart of the Books Route
app.use("/categories", categoryRoutes);
app.use("/reviews", reviewRoutes);
app.use("/users", userRoutes);

// Our Home route
app.get("/", function (req, res) {
  res.render("home", {
    books: books, // Pass books data to the view
  });
});

// Added can remove with corresponding ejs
// Function to read JSON data from files
function readDataFile(filePath) {
  const data = fs.readFileSync(filePath);
  return JSON.parse(data);
}

// A Function to write data to JSON files for our Books-list and Reviews
function writeDataFile(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}
// W.I.P
app.get("/users", (req, res) => {
  const users = readDataFile("data/users.json");
  const books = readDataFile("data/books.json"); // Get books from JSON file
  const authors = readDataFile("data/authors.json"); // Get authors from JSON file
  res.render("users", { users: users, books, authors }); //
});

// Home route We want to list our books on the page
// Display authors
app.get("/", (req, res) => {
  const books = readDataFile("data/books.json"); // Get books from JSON file
  const authors = readDataFile("data/authors.json"); // Get authors from JSON file
  res.render("home", { books: books, authors: authors });
});

// to show my collections
// app.get("/", (req, res) => {
//   const collections = readDataFile("data/collections.json"); // Get collections
//   res.render("home", { collections: collections });
// });

// Display authors
// app.get("/authors", (req, res) => {
//   const authors = readDataFile("data/authors.json"); // Get authors from JSON file
//   res.json(authors); // Respond with authors in JSON format
// });

// Display books
// app.get("/books", (req, res) => {
//   const books = readDataFile("data/books.json"); // Get books from JSON file
//   res.json(books); // Respond with books in JSON format
// });

// Display our categories
app.get("/categories", (req, res) => {
  const categories = readDataFile("data/categories.json"); // Get categories from JSON file
  res.json(categories); // Respond with categories in JSON format
});

// Our books reviews W.I.P
app.get("/reviews-list", (req, res) => {
  const reviews = readDataFile("data/books.json"); // Get reviews from JSON file
  res.json(reviews);
});

// app.get("/users", (req, res) => {
//   const users = readDataFile("data/users.json"); // Get reviews from JSON file
//   res.json(users);
// });

// Render books list with EJS
// app.get("/books-list", (req, res) => {
//   const books = readDataFile("data/books.json"); // Get books from JSON file
//   res.render("home", { home });
// });

// To get our Book-list
app.get("/books-list", (req, res) => {
  const books = readDataFile("data/books.json"); // Get books from JSON file
  res.render("books", { books: books });
});

// // Render authors list with EJS
// app.get("/authors-list", (req, res) => {
//   const authors = readDataFile("data/authors.json"); // Get authors from JSON file
//   res.render("authors", { authors: authors });
// });

// Render categories list with EJS
app.get("/categories-list", (req, res) => {
  const categories = readDataFile("data/categories.json"); // Get categories from JSON file
  res.render("categories", { categories: categories });
});

// This works
// POST route to add a new book
// app.post("/books", (req, res) => {
//   const { bookName, bookAuthor, bookPages, bookPrice } = req.body;
//   const newBook = {
//     // bookId,
//     bookName,
//     bookAuthor,
//     bookPages,
//     bookPrice,
//     bookState: "Available",
//     isFavorited: false,
//   };
//   const books = readDataFile("data/books.json");
//   books.push(newBook);
//   writeDataFile("data/books.json", books); // Save updated books list to JSON
//   res.redirect("/books");
// });

// This should replace the code above, for listing books in order
app.post("/books", (req, res) => {
  const { bookName, bookAuthor, bookPages, bookPrice } = req.body;
  const books = readDataFile("data/books.json");
  const maxId =
    books.length > 0 ? Math.max(...books.map((book) => book.id)) : 0;
  const newBook = {
    id: maxId + 1, // Increment the highest id by 1
    bookName,
    bookAuthor,
    bookPages,
    bookPrice,
    bookState: "Available",
    isFavorited: false, // Initially, the book is not favorited
  };
  books.push(newBook);
  writeDataFile("data/books.json", books);
  res.redirect("/books"); // Redirect to the list of books
});

//This works!
// DELETE route for books
app.post("/books/delete/:id", (req, res) => {
  const bookId = req.params.id;
  const books = readDataFile("data/books.json");
  const bookIndex = books.findIndex((book) => book.id == bookId);
  if (bookIndex === -1) {
    return res.status(404).send("Book not found");
  }
  books.splice(bookIndex, 1);
  writeDataFile("data/books.json", books);
  res.redirect("/books");
});

// temp
app.get("reviews", (req, res) => {
  res.render("/reviews", { reviews: reviews });
});

// Render reviews list with EJS
app.get("/reviews", (req, res) => {
  const reviews = readDataFile("data/books.json"); // Get reviews from JSON file
  if (req.query.id) {
    const review = reviews[req.query.id];
    if (!review) {
      return res.status(404).send("Review not found");
    }
    res.render("reviews", {
      reviews: reviews,
      editReview: review,
      editId: req.query.id,
    });
  } else {
    res.render("reviews", { reviews: reviews });
  }
});

// Post a Review
app.post("/reviews", (req, res) => {
  const { author, text } = req.body;
  const newReview = { author, text };
  const reviews = readDataFile("data/books.json");
  reviews.push(newReview);
  writeDataFile("data/reviews.json", reviews);
  res.redirect("/reviews");
});

// To Edit
app.post("/reviews/edit/:id", (req, res) => {
  const { author, text } = req.body;
  const reviews = readDataFile("data/books.json");
  const review = reviews[req.params.id];
  if (!review) {
    return res.status(404).send("Review not found");
  }
  review.author = author;
  review.text = text;
  writeDataFile("data/books.json", reviews);
  res.redirect("/reviews");
});

// To Delete can use delete instead
app.get("/reviews/delete/:id", (req, res) => {
  const reviews = readDataFile("data/books.json");
  const reviewIndex = req.params.id;
  if (reviewIndex < 0 || reviewIndex >= reviews.length) {
    return res.status(404).send("Review not found");
  }
  reviews.splice(reviewIndex, 1); // Remove the review
  writeDataFile("data/books.json", reviews);
  res.redirect("/reviews");
});

// POST route to add a new category
app.post("/categories", (req, res) => {
  const { categoryName, categoryDescription } = req.body;
  const newCategory = { categoryName, categoryDescription };
  const categories = readDataFile("data/categories.json");
  categories.push(newCategory);
  writeDataFile("data/categories.json", categories); // Save updated categories list to JSON
  res.redirect("/categories-list");
});

//   // After adding the book, redirect to the homepage
//   res.redirect("/");
// });

// Our Error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: "Something went wrong!" });
});

// Start server
app.listen(port, () => {
  console.log(`LiberUnited is running on port ${port}`);
});
