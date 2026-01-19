const adminMiddleware = (req, res, next) => {
    try {
        const { role } = req.user;
        if (role !== "admin") {
            return res.status(401).json({
                message: "Unauthorized"
            })
        }
        next();
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        })
    }
}

export default adminMiddleware;
