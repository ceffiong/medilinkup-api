const jwt = require('jsonwebtoken')
const nodemon = require('../../nodemon.json')

module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, nodemon.env.JWT_KEY);
        
        next();
        req.healthworkerData = decoded;
    }catch(error){
        return res.status(401).json({
            message: 'Auth failed'
        })
    }
};