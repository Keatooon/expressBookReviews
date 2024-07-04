const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req,res) => {
  //Write your code here
    //   return res.status(300).json({message: "Yet to be implemented"});
    const { username, password } = req.body;
    if (!username || !password) {
    return res.status(400).json({ message: "Username & password are needed" });
    }
    if (users.find((user) => user.username === username)) {
    return res.status(409).json({ message: "Username already taken" });
    }
    users.push({ username, password });
    return res.status(201).json({ message: "User registered" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
  res.send(JSON.stringify(books, null, 4));

});

// Tasks 10
// Get the book list available in the shop using async/await with Axios
public_users.get(('/asyncbookslist', async (req, res) => {
    try {
      const response = await axios.get('http://localhost:5008/'); // Replace with your API endpoint or data source
      const booksData = JSON.stringify(response.data, null, 4);
      res.send(booksData);
    } catch (error) {
      console.error('Error fetching books:', error);
      res.status(500).json({ message: 'Failed to fetch books' });
    }
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if (books[isbn]) {
      return res.json(books[isbn]);
  } else {
      return res.status(404).json({ message: "Book does not exist" });
  }
//   return res.status(300).json({message: "Yet to be implemented"});
 });


 // Tasks 11
 // Get book details based on ISBN using async/await with Axios
 public_users.get('/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    
    try {
      if (books[isbn]) {
        res.json(books[isbn]);
      } else {
        res.status(404).json({ message: "Book does not exist" });
      }
    } catch (error) {
      console.error('Error fetching book details:', error);
      res.status(500).json({ message: 'Failed to fetch book details' });
    }
});

  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
    const author = req.params.author;  
    const authorBooks = [];  

    for (const book in books) {  
    if (books[book].author === author) {  
        authorBooks.push(books[book]);
    }
    }

    if (authorBooks.length > 0) {  
        res.send(authorBooks);  
    } else {
        res.status(404).send('Author has no books');  
    }
});

// Tasks 12
// Get book details based on author
public_users.get('/author/:author', async function(req, res) {
    const author = req.params.author;

    try {
        // Simulating an asynchronous call to an external API using Axios
        const response = await axios.get(`http://localhost:5008/books?author=${author}`);

        const authorBooks = response.data;

        if (authorBooks.length > 0) {
            res.send(authorBooks);
        } else {
            res.status(404).send('Author has no books');
        }
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).send('Server Error');
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
    const title = req.params.title.toLowerCase();
    const filteredBooks = Object.values(books).filter(book => book.title.toLowerCase().includes(title));
    if(filteredBooks.length > 0){
        return res.status(200).json(filteredBooks);
    }
    else{
        return res.status(404).json({message: "Book not found"});
    }
});

// Tasks 13
// Get all books based on title
public_users.get('/title/:title', async function(req, res) {
    const title = req.params.title.toLowerCase();

    try {
        // Simulating an asynchronous call to an external API using Axios
        const response = await axios.get(`http://localhost:5008/books?title=${title}`);

        const filteredBooks = response.data;

        if (filteredBooks.length > 0) {
            res.status(200).json(filteredBooks);
        } else {
            res.status(404).json({ message: "Book not found" });
        }
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).send('Server Error');
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
    const isbn = req.params.isbn;

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    const reviews = books[isbn].reviews;

    return res.status(200).json({ reviews: reviews });
});

module.exports.general = public_users;
