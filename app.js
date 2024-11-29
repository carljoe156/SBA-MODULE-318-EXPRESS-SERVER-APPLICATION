const express = require("express");
const indexRouter = require("./routes/index.js");
const port = 3000; //my port can remove if anything
const app = express();
const bodyParser = require("body-parser");

// These are the routes
const bookRoutes = require("./routes/books");
const authorRoutes = require("./routes/authors");
const reviewRoutes = require("./routes/reviews");

// For the view engine start
app.set("views", "views");
app.set("view engine", "ejs");

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public")); // for serving static images and css files

app.use("/", indexRouter);

// Our routes EndPoints (maybe you should access this ...)
app.use("/books", bookRoutes); //  /api/books route for books (could use /api/books etc)
app.use("/authors", authorRoutes); // /api/authors route for authors
app.use("/reviews", reviewRoutes); // /api/reviews route for reviews

// For the Server
app.listen(3000, () => {
  console.log(`Express is running on http://localhost:${port}`);
});
