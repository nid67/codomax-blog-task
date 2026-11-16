require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // This scrambles the passwords

// Import your database rules (Schemas)
const User = require('./models/User');
const Blog = require('./models/Blog');

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { family: 4 })
    .then(() => console.log('Successfully connected to MongoDB!'))
    .catch((error) => console.error('MongoDB connection error:', error));

// --- 1. User Registration (Secure Hashing) ---
app.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Ask DB: Does this email already exist?
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already registered" });
        }

        // Security: Scramble the password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Save new user to the DB
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save(); // .save() writes it to MongoDB permanently

        res.status(201).json({ message: "Registration successful!" });
    } catch (error) {
        res.status(500).json({ error: "Server error during registration" });
    }
});

// --- 2. User Login (Secure Comparison) ---
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Ask DB: Find the user by this email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Security: Compare the typed password with the scrambled one in the DB
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        res.status(200).json({ message: "Login successful!", name: user.name });
    } catch (error) {
        res.status(500).json({ error: "Server error during login" });
    }
});

// --- 3. Create Blog API ---
app.post('/blogs', async (req, res) => {
    try {
        const { title, content, author } = req.body;

        const newBlog = new Blog({ title, content, author: author || "Anonymous" });
        await newBlog.save(); // Writes blog to MongoDB

        res.status(201).json({ message: "Blog published successfully!", blog: newBlog });
    } catch (error) {
        res.status(500).json({ error: "Failed to create blog" });
    }
});

// --- 4. Get All Blogs API ---
app.get('/blogs', async (req, res) => {
    try {
        // .find() gets all blogs, .sort() orders them newest first
        const blogs = await Blog.find().sort({ createdAt: -1 }); 
        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch blogs" });
    }
});

// --- 5. Get Single Blog API (For Objective 4) ---
app.get('/blogs/:id', async (req, res) => {
    try {
        // req.params.id grabs the ID from the URL
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ error: "Blog not found" });
        }
        res.status(200).json(blog);
    } catch (error) {
        res.status(500).json({ error: "Invalid blog ID" });
    }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Backend server is running on http://localhost:${PORT}`);
});