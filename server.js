// server.js
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors()); // Allows frontend (running on a different port/file) to connect
app.use(express.json()); // Automatically parses incoming JSON data from the frontend

// Temporary in-memory databases
const users = [];
const blogs = [];

// --- 1. User Registration API ---
app.post('/register', (req, res) => {
    const { name, email, password } = req.body;

    // Check if the user already exists
    const userExists = users.find(user => user.email === email);
    if (userExists) {
        return res.status(400).json({ error: "Email already registered" });
    }

    // Save the new user
    users.push({ name, email, password });
    res.status(201).json({ message: "Registration successful!" });
});

// --- 2. User Login API ---
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Find the user by email
    const user = users.find(user => user.email === email);
    
    // Check if user exists and password matches
    if (!user || user.password !== password) {
        return res.status(401).json({ error: "Invalid email or password" });
    }

    res.status(200).json({ message: "Login successful!", name: user.name });
});

// --- 3. Create Blog API ---
app.post('/blogs', (req, res) => {
    const { title, content, author } = req.body;

    if (!title || !content) {
        return res.status(400).json({ error: "Title and content are required" });
    }

    const newBlog = { id: Date.now(), title, content, author: author || "Anonymous" };
    blogs.push(newBlog);
    
    res.status(201).json({ message: "Blog published successfully!", blog: newBlog });
});

// --- 4. Get All Blogs API (Needed for your Dashboard) ---
app.get('/blogs', (req, res) => {
    res.status(200).json(blogs);
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Backend server is running on http://localhost:${PORT}`);
});