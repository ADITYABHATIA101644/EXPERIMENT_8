const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    // Get token from header (Format: Bearer <token>)
    const token = req.header('Authorization')?.split(' ')[1];
    
    if (!token) return res.status(401).json({ message: "Access Denied: No Token Provided" });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
        req.user = verified; // Contains id and role
        next();
    } catch (err) {
        res.status(400).json({ message: "Invalid Token" });
    }
};

// RBAC Middleware: Check if the user has the required role
const checkRole = (role) => {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return res.status(403).json({ message: "Access Denied: Insufficient Permissions" });
        }
        next();
    };
};

module.exports = { verifyToken, checkRole };