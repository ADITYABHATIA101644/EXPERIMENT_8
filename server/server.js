const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// 1. Database Connection
const MONGO_URI = "mongodb+srv://Aditya:Aadi010.@cluster0.g0l9d0y.mongodb.net/?appName=Cluster0";
const JWT_SECRET = "Aditya_Super_Secret_123"; // Keep this consistent

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("✅ Connected to MongoDB Atlas");
        seedAdmin(); // Run seeding logic on connection
    })
    .catch(err => console.log("❌ DB Connection Error:", err));

// 2. User Schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' }
});
const User = mongoose.model('User', userSchema);

// 3. Admin Seeding Logic (Ensures you can always log in)
const seedAdmin = async () => {
    try {
        const adminExists = await User.findOne({ username: 'Aditya' });
        if (!adminExists) {
            const hashedPassword = await bcrypt.hash('Aadi010.', 10);
            await User.create({
                username: 'Aditya',
                password: hashedPassword,
                role: 'admin'
            });
            console.log("🚀 Admin 'Aditya' created in Database.");
        } else {
            console.log("ℹ️ Admin 'Aditya' already exists in Database.");
        }
    } catch (error) {
        console.log("Seeding Error:", error);
    }
};

// 4. Routes

// LOGIN ROUTE (Experiment 3.1.1 & 3.1.2)
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(401).json({ error: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: "Wrong credentials" });

        // Generate JWT
        const token = jwt.sign(
            { id: user._id, role: user.role },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            token,
            user: { username: user.username, role: user.role }
        });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

// PROTECTED ADMIN DATA (Experiment 3.1.3)
app.get('/api/admin/data', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: "No token provided" });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.role !== 'admin') {
            return res.status(403).json({ error: "Forbidden: Admins only" });
        }
        res.json({ message: "Hello Aditya! You have successfully accessed Admin Data using RBAC." });
    } catch (err) {
        res.status(401).json({ error: "Invalid token" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server active on port ${PORT}`));

// Add this right before app.listen()
const path = require('path');
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('(.*)', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'));
  });
}