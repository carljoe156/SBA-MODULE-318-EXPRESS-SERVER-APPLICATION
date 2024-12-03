const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const dataFilePath = path.join(__dirname, "users.json");

const readData = () => {
  const data = fs.readFileSync(dataFilePath, "utf-8");
  return JSON.parse(data);
};

const writeData = (data) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), "utf-8");
};

// Route to get all users
router.get("/users", (req, res) => {
  const users = readData(); // Read data from users.json
  res.json(users);
});

// Route to get a single user by ID
router.get("/users/:id", (req, res) => {
  const users = readData();
  const userId = parseInt(req.params.id);
  const user = users.find((u) => u.id === userId);
  if (user) {
    res.json(user);
  } else {
    res.status(404).send("User not found");
  }
});

// Route to create a new user
router.post("/users", (req, res) => {
  const { name, email } = req.body;
  const users = readData();
  const newUser = {
    id: users.length + 1, // Auto-increment ID
    name,
    email,
  };
  users.push(newUser);
  writeData(users); // Write the updated data back to users.json
  res.status(201).json(newUser);
});

// Route to update a user by ID
router.put("/users/:id", (req, res) => {
  const users = readData();
  const userId = parseInt(req.params.id);
  const { name, email } = req.body;

  const userIndex = users.findIndex((u) => u.id === userId);
  if (userIndex === -1) {
    return res.status(404).send("User not found");
  }

  users[userIndex] = { id: userId, name, email };
  writeData(users); // Write the updated data back to users.json
  res.json(users[userIndex]);
});

// Route to delete a user by ID
router.delete("/users/:id", (req, res) => {
  const users = readData();
  const userId = parseInt(req.params.id);

  const userIndex = users.findIndex((u) => u.id === userId);
  if (userIndex === -1) {
    return res.status(404).send("User not found");
  }

  users.splice(userIndex, 1); // Remove the user from the array
  writeData(users); // Write the updated data back to users.json
  res.status(200).send("User deleted");
});

// Export the router
module.exports = router;
