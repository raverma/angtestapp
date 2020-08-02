const express = require('express');
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const User = require('../models/user');

const router = express.Router();


router.post("/api/user/signup", (req, res, next)=> {
    bcrypt.genSalt(10, (err, salt)=>{
        bcrypt.hash(req.body.password, salt, (err, hash)=>{
            const user = new User ({
                firstname: req.body.firstName,
                lastname: req.body.lastName,
                email: req.body.email,
                password: hash
            });
            user.save()
                .then((result) => {
                    res.status(201).json({
                        message: "User created",
                        result: result
                    });
                })
                .catch(err => {
                    res.status(500).json({
                        error: err
                    });
                });
        });
    });
  
    
});


router.post("/api/user/login", (req, res, next)=> {
    let fetchedUser;
    User.findOne({email: req.body.email})
        .then( user => {
            if (!user){
                return res.status(401).json({
                    message: "Authentication failed. User does not exist."
                });
            }
            fetchedUser = user;
            return bcrypt.compare(req.body.password, user.password);
        })
        .then(result => {
            if (!result){
                return res.status(401).json({
                    message: "Authentication failed. Password is incorrect."
                });
            }
            const token = jwt.sign({email: fetchedUser.email, userId: fetchedUser._id}, 
                    "a_long_secret", 
                    {expiresIn: "1h"}
                );
                res.status(200).json({
                    message: "User Authenticated",
                    token: token,
                    expires: 3600
                });
            } 
        )
        .catch(err => {
            res.status(401).json({
                message: err 
            });
        });
});
module.exports = router;
