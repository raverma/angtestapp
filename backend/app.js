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

app.post('/api/posts', (req, res, next)=> {
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    });
    post.save().then((result)=>{
        res.status(201).json(
            {message: "Your post has been added", postId:result._id}
    )});
});



app.delete('/api/posts/:id', (req, res, next)=> {
    console.log(req.params.id);
    Post.deleteOne({_id: req.params.id}).then( result=>{
        console.log(result);
        res.status(200).json({message: "Post Deleted"});
    });
    
});

app.put('/api/posts/:id', (req, res, next)=> {
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content
    });
    console.log(post);
    Post.updateOne({_id: req.params.id}, post).then( result => {
        console.log(result);
        res.status(200).json({message: 'Post updated successfully'});
    });
});

app.get('/api/posts',(req, res, next )=> {
 
    Post.find()
    .then((documents)=>{
      // var posts = [];
      // documents.forEach((post)=> {
      //      posts.push({id: post._id, title: post.title, content: post.content});
      // });
        res.status(200).json({
            message: "Posts fetched successfully",
            posts: documents
        });
    })
    .catch((err) => {
        console.log(err);
        return;
    });

 
});


app.get('/api/posts/:id', (req, res, next)=> {
    const postId = req.params.id;
    
    Post.findById(postId).then(post=>{
        if (post){
            res.status(200).json({id: post._id, title: post.title, content: post.content}); 
        }
        else {
            res.status(404).json({message: "Post not found"});
        }
    });
});
module.exports = app;
