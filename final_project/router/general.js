const express = require('express');
let books = require("./booksdb.js").books;
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username
  const password = req.body.password

  if (!username || !password) {
    res.send("Body did not contain username or password")
    return
  }
  if (!isValid(username)) {
    res.send("User already authenticated!")
  }
  users.push({"username": username, "password": password})

  res.send(`Registered user ${username}`)
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  let promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(JSON.stringify(books, null, 4))
    }, 0)

  })
  promise.then((str) => {
    res.send(str)
  })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const ISBN = req.params.isbn
  let promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(JSON.stringify(books[ISBN], null, 4))
    }, 0)
  })
  promise.then((str) => {
    res.send(str)
  })
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  let promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      const author = req.params.author
      var filtered = {}
      for (const [key, value] of Object.entries(books)) {
        if (value.author == author) {
          filtered[key] = value
        }
      }
      resolve(JSON.stringify(filtered, null, 4));
    }, 0)
  })

  promise.then((str) => {
    res.send(str)
  })
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  let promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      const title = req.params.title
      var filtered = {}
      for (const [key, value] of Object.entries(books)) {
        if (value.title == title) {
          filtered[key] = value
        }
      }
      resolve(JSON.stringify(filtered, null, 4))
    }, 0)
  })

  promise.then((str) => {
    res.send(str)
  })
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn
  const book = books[isbn]
  res.send(JSON.stringify(book.reviews));
});

module.exports.general = public_users;
