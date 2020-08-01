const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        jwt.verify(token,"a_long_secret");
        next();
    } catch (error) {
        res.status(401).json({
            message: error
        });
    }
    
    
}