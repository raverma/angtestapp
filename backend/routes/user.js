const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const router = express.Router();


router.post("/api/user/signup", (req, res, next)=> {
    bcrypt.genSalt(10, (err, salt)=>{
        bcrypt.hash(req.body.password, salt, (err, hash)=>{
            console.log(req.body);
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

module.exports = router;
