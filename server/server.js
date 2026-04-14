const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// 1. Database Connection
// Using the string you provided. In production, Render will use the MONGO_URI from Environment Variables.
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://Aditya:Aadi010.@cluster0.g0l9d0y.mongodb.net/?appName=Cluster0";
const JWT_SECRET = process.env.JWT_SECRET || "Aditya_Super_Secret_123";

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("✅ Connected to MongoDB Atlas");
        seedAdmin(); // Creates your account automatically
    })
    .catch(err => console.log("❌ DB Connection Error:", err));

// 2. User Schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' }
});
const User = mongoose.model('User', userSchema);

// 3. Admin Seeding Logic (Experiment 3.1.3 setup)
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
            console.log("🚀 Admin 'Aditya' created successfully.");
        } else {
            console.log("ℹ️ Admin 'Aditya' is already in the database.");
        }
    } catch (error) {
        console.log("Seeding Error:", error);
    }
};

// 4. API Routes

// Login Route (Experiment 3.1.1 & 3.1.2)
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(401).json({ error: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

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
        res.status(500).json({ error: "Server error during login" });
    }
});

// Protected Admin Data (Experiment 3.1.3 RBAC)
app.get('/api/admin/data', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: "Access Denied: No Token" });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.role !== 'admin') {
            return res.status(403).json({ error: "Forbidden: Admins only" });
        }
        res.json({ message: "Hello Aditya! You have successfully accessed Admin Data using RBAC." });
    } catch (err) {
        res.status(401).json({ error: "Invalid or expired token" });
    }
});

// 5. Deployment Logic (Serving the React Frontend)
// This is where the previous 'PathError' occurred. Updated to modern syntax.
// 5. Deployment Logic (Serving the React Frontend)
if (process.env.NODE_ENV === 'production') {
    const buildPath = path.join(__dirname, '../client/build');
    app.use(express.static(buildPath));

    // Using a Regex Literal instead of a string to avoid PathError
    app.get(/^(?!\/api).+/, (req, res) => {
        res.sendFile(path.resolve(buildPath, 'index.html'));
    });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});