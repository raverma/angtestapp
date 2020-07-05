const express = require('express');
const bodyParser = require('body-parser');
const { createModuleResolutionCache } = require('typescript');
const Post = require('./models/post');
const mongoose = require('mongoose');
const app = express();

mongoose.connect("mongodb+srv://postsadmin:postsadminpwd@cluster0-zqzck.mongodb.net/MyPosts?retryWrites=true&w=majority",{useNewUrlParser: true, useUnifiedTopology: true})
.then(()=> {
    console.log('Database connected successfully');
})
.catch(()=>{
    console.log("Connection failed......exiting !!!");
    return;
});

app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next)=> {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods","GET, POST, PATCH, DELETE, OPTIONS");
    next();
});

app.post('/api/posts', (req, res, next)=> {
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    });
    post.save();
    console.log(post);

    res.status(201).json(
        {message: "Your post has been added"}
    );
});

app.get('/api/posts',(req, res, next )=> {
    const posts= [];
    Post.find()
    .then((documents)=>{

        res.status(200).json({
            message: "Posts fetched successfully",
            posts: documents
        });
    })
    .catch((err) => {
        console.log("Error in fetching posts");
        return;
    });

 
});

app.use('/',(req, res)=> {
    console.log('Second middleware');
    res.send('Hello from root');
});

module.exports = app;
