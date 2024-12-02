const express = require("express");
const fs = require("fs");
const router = express.Router();

router.get("/users", (req, res) => {
  const books = readCollectionsData();
  res.render("users", { books });
});

// This function helpers to read/write to JSON files
function readDataFile(filePath) {
  const data = fs.readFileSync(filePath);
  return JSON.parse(data);
}

function writeDataFile(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// THis Route: Shows edits  on the collection page
router.get("/edit-collection/:collectionId", (req, res) => {
  const collectionId = req.params.collectionId; // Get collection ID from URL
  const collections = readDataFile("data/collections.json"); // Get all collections
  const collection = collections.find((c) => c.id === collectionId); // Find specific collection

  if (collection) {
    // Fetch books that belong to this collection
    res.render("edit-book", { collectionId, books: collection.books });
  } else {
    res.status(404).send("Collection not found");
  }
});

// This Route: Updates the collection (Adds/Updates/Deletes the Books)
router.post("/update-collection/:collectionId", (req, res) => {
  const collectionId = req.params.collectionId;
  const collections = readDataFile("data/collections.json"); // Get all collections
  const collection = collections.find((c) => c.id === collectionId); // Find specific collection

  if (collection) {
    const updatedBooks = collection.books.map((book) => {
      const updatedBook = { ...book };

      // Checks to see if there are updates for this book
      if (req.body[`bookName-${book.id}`]) {
        updatedBook.bookName = req.body[`bookName-${book.id}`];
        updatedBook.bookAuthor = req.body[`bookAuthor-${book.id}`];
        updatedBook.bookPages = req.body[`bookPages-${book.id}`];
        updatedBook.bookPrice = req.body[`bookPrice-${book.id}`];
      }

      return updatedBook;
    });

    // This should handle book deletion
    const action = req.body.action;
    if (action && action.startsWith("delete-")) {
      const bookIdToDelete = action.split("-")[1];
      collection.books = collection.books.filter(
        (book) => book.id !== bookIdToDelete
      ); // Remove book
    } else {
      collection.books = updatedBooks; // Update collection books
    }

    // This should handle new books
    if (req.body.action === "add") {
      const newBook = {
        id: Date.now().toString(),
        bookName: req.body.newBookName,
        bookAuthor: req.body.newBookAuthor,
        bookPages: req.body.newBookPages,
        bookPrice: req.body.newBookPrice,
      };
      collection.books.push(newBook); // Add new book
    }

    // Saves an updated collection
    writeDataFile("data/collections.json", collections);
    res.redirect(`/users/edit-collection/${collectionId}`); // Redirect back to the same collection
  } else {
    res.status(404).send("Collection not found");
  }
});

module.exports = router;
