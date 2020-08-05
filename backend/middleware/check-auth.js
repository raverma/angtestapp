const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        const decodedToken = jwt.verify(token,"a_long_secret");
        req.userData = { email: decodedToken.email, userId: decodedToken.userId}
        
        next();
    } catch (error) {
        res.status(401).json({
            message: error
        });
    }
    
    
}