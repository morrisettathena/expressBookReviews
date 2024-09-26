const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js").books;
let isValidISBN = require("./booksdb.js").isValidISBN
const regd_users = express.Router();
const axios = require("axios")

let users = [];

const isValid = (username) => { //returns boolean
  if (!username) {
    return false
  }

  const filtered = users.filter((user) => {
    return user.username == username
  })
  return filtered.length == 0
}

const authenticatedUser = (username, password) => { //returns boolean
  //write code to check if username and password match the one we have in records.
  if (!username || !password) {
    return false
  }
  const filtered = users.filter((user) => {
    return (user.username == username && user.password == password)
  })
  if (filtered.length == 0) {
    return false
  }
  return true

}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username
  const password = req.body.password

  // Check if username or password is missing
  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });

  }
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, "access", { expiresIn: 60 * 60 })

    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send("User succesfully logged in");

  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const ISBN = req.params.isbn
  const username = req.session.authorization.username;
  const review = req.body.review
  if (!review) {
    res.status(400).send("Review does not exist")
    return
  }
  let update = false

  if (books[ISBN]["reviews"][username]) {
    update = true
  }

  books[ISBN]["reviews"][username] = review
  if (update) {
    res.send(`Updated review of book with ISBN ${ISBN}`)
  }
  else {
    res.send(`Posted review of book with ISBN ${ISBN}`)
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const ISBN = req.params.isbn
  const username = req.session.authorization.username;

  if (!isValidISBN(ISBN)) {
    return res.status(400).send(`No such ISBN ${ISBN}`)
  }
  delete books[ISBN]["reviews"][username]
  res.send("Deleted your review")
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

