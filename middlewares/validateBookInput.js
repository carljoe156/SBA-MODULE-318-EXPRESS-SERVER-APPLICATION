function validateBookInput(req, res, next) {
  const { bookName, bookAuthor, bookPrice } = req.body;
  if (!bookName || !bookAuthor || !bookPrice) {
    return res.status(400).send("Missing required fields for book.");
  }
  next(); // Passes the control to the next middleware
}

module.exports = validateBookInput;
