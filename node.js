// server.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/blogDB', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

// Check MongoDB connection
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Check for MongoDB connection errors
db.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

// Create Post schema
const postSchema = new mongoose.Schema({
    title: String,
    content: String
});

// Create Post model
const Post = mongoose.model('Post', postSchema);

// Middleware for parsing JSON bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (HTML, CSS, JavaScript)
app.use(express.static('public'));

// Route to get all posts
app.get('/posts', (req, res) => {
    Post.find({}, (err, posts) => {
        if (err) {
            console.error('Error fetching posts:', err);
            res.status(500).send('Error fetching posts');
        } else {
            res.json(posts);
        }
    });
});

// Route to create a new post
app.post('/posts', (req, res) => {
    const newPost = new Post({
        title: req.body.title,
        content: req.body.content
    });
    newPost.save((err) => {
        if (err) {
            console.error('Error creating post:', err);
            res.status(500).send('Error creating post');
        } else {
            res.status(200).send('Post created successfully');
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
