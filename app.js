const express = require("express");
const indexRouter = require("./routes/index.js");
const path = require("path");
const fs = require("fs");
const bodyParser = require("body-parser");

// These are the routes
const bookRoutes = require("./routes/books");
const authorRoutes = require("./routes/authors");
const reviewRoutes = require("./routes/reviews");

const port = 3000; //my port can remove if anything
const app = express();

// For the view engine start
app.set("views", "views");
app.set("view engine", "ejs");

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public")); // for serving static images and css files

// Our next middleware checker
const checkerMiddleware = (req, res, next) => {
  console.log(
    `${req.method} request to ${req.url} at ${new Date().toISOString()}`
  );
  next();
};
//active for all routes
app.use(checkerMiddleware);

// Our routes EndPoints (maybe you should access this ...)
app.use("/", indexRouter);
app.use("/books", bookRoutes); //  /api/books route for books (could use /api/books etc)
app.use("/authors", authorRoutes); // /api/authors route for authors
app.use("/categories", categoryRoutes); // /api/category route for category
app.use("/reviews", reviewRoutes); // /api/reviews route for reviews

// for serving the "data" folder as static files // may have to change idk yet, I should be able to pull from for example /data/authors.json
app.use("/data", express.static(path.join(__dirname, "data")));

// We need to be able to update our JSON files
function writeDataFile(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Routes Get sections
// For our Home route lists books
app.get("/", (req, res) => {
  const books = readDataFile("data/books.json"); // Gets books or listing from JSON file, can probably change this functionality in the future
  res.render("home", { books: books });
});

// To display our authors
app.get("/authors", (req, res) => {
  const authors = readDataFile("data/authors.json"); //Gets authors listing from JSON
  res.json(authors);
});

// To display our books
app.get("/books", (req, res) => {
  const books = readDataFile("data/books.json"); //Gets authors listing from JSON
  res.json(books);
});

// To display our categories
app.get("/categories", (req, res) => {
  const categories = readDataFile("data/categories.json"); // Gets categories from JSON
  res.json(categories);
});

// Rendering Section - using our EJS Template Engine
app.get("/books-list", (req, res) => {
  const books = readDataFile("data/books.json"); // Gets books from JSON
  res.render("books", { books: books });
});

app.get("/authors-list", (req, res) => {
  const authors = readDataFile("data/authors.json"); // Gets authors from JSON
  res.render("authors", { authors: authors });
});

app.get("/categories-list", (req, res) => {
  const categories = readDataFile("data/categories.json"); // Gets categories from JSON
  res.render("categories", { categories: categories });
});

app.get("/books-list", (req, res) => {
  const books = readDataFile("data/books.json"); // Gets books from JSON
  res.render("books", { books: books });
});

app.get("/authors-list", (req, res) => {
  const authors = readDataFile("data/authors.json"); // Gets authors from JSON
  res.render("authors", { authors: authors });
});

app.get("/categories-list", (req, res) => {
  const categories = readDataFile("data/categories.json"); // Gets categories from JSON
  res.render("categories", { categories: categories });
});

//  Using POST route to add a new book, if you're a bibliophile of course!
app.post("/books", (req, res) => {
  const { bookName, bookAuthor, bookPages, bookPrice } = req.body;
  const newBook = {
    bookName,
    bookAuthor,
    bookPages,
    bookPrice,
    bookState: "Available",
  };
  const books = readDataFile("data/books.json");
  books.push(newBook);
  writeDataFile("data/books.json", books); // Should enable persistence in updating books list to JSON
  res.redirect("/books-list");
});

// Using POST route to add a new author
app.post("/authors", (req, res) => {
  const { authorName, authorBio } = req.body;
  const newAuthor = { authorName, authorBio };
  const authors = readDataFile("data/authors.json");
  authors.push(newAuthor);
  writeDataFile("data/authors.json", authors); //Should enable persistence in updating authors list to JSON
  res.redirect("/authors-list");
});

// Using POST route to add a new category
app.post("/categories", (req, res) => {
  const { categoryName, categoryDescription } = req.body;
  const newCategory = { categoryName, categoryDescription };
  const categories = readDataFile("data/categories.json");
  categories.push(newCategory);
  writeDataFile("data/categories.json", categories); //Should enable persistence in updating categories list to JSON
  res.redirect("/categories-list");
});

// These are tests
// Using POST route to add new book
app.post("/", (req, res) => {
  const inputBookName = req.body.bookName;
  const inputBookAuthor = req.body.bookAuthor;
  const inputBookPages = req.body.bookPages;
  const inputBookPrice = req.body.bookPrice;

  // Adds a new book to the books array
  books.push({
    bookName: inputBookName,
    bookAuthor: inputBookAuthor,
    bookPages: inputBookPages,
    bookPrice: inputBookPrice,
    bookState: "Available",
  });

  // After adding the book, redirect to the homepage
  res.redirect("/");
}); //fix

// For Server middleware for error-handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: "Something went wrong!" });
});

//

// // to read the json files
// function readJsonFile(filePath) {
//   return new Promise((resolve, reject) => {
//     fs.readFile(filePath, "utf8", (err, data) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(JSON.parse(data));
//       }
//     });
//   });
// }

// // To render the books to the page
// app.get("/", async (req, res) => {
//   try {
//     const books = await readJsonFile(
//       path.join(__dirname, "data", "books.json")
//     );
//     res.render("index", { books: books, title: "Bookstore" });
//   } catch (error) {
//     res.status(500).send("Error reading books data");
//   }
// });

// For the Server Start
app.listen(port, () => {
  console.log(`Express is running on http://localhost:${port}`);
});
