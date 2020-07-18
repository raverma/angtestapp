const express = require('express');

const bodyParser = require('body-parser');
const { createModuleResolutionCache } = require('typescript');
const Post = require('./models/post');
const mongoose = require('mongoose');

const postsRoutes =  require('./routes/posts');
const app = express(postsRoutes);

mongoose.connect("mongodb+srv://postsadmin:postsadminpwd@cluster0-zqzck.mongodb.net/MyPosts?retryWrites=true&w=majority",{useNewUrlParser: true, useUnifiedTopology: true})
.then(()=> {
    console.log('Database connected successfully');
})
.catch((err)=>{
    console.log("Connection failed......exiting !!!");
    console.log(err);
    return;
});

app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next)=> {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods","GET, POST, PUT, PATCH, DELETE, OPTIONS");
    next();
});


app.use(postsRoutes);

module.exports = app;
