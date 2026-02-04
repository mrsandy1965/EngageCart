const adminMiddleware = (req, res, next) => {
    // This middleware must be used after authMiddleware
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized - No user found' });
    }

    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden - Admin access required' });
    }

    next();
};

export default adminMiddleware;
