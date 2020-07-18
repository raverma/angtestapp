const express = require('express');

const Post = require('../models/post');

const router = express.Router();


router.post('/api/posts', (req, res, next)=> {
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    });
    post.save().then((result)=>{
        res.status(201).json(
            {message: "Your post has been added", postId:result._id}
    )});
});



router.delete('/api/posts/:id', (req, res, next)=> {
    console.log(req.params.id);
    Post.deleteOne({_id: req.params.id}).then( result=>{
        console.log(result);
        res.status(200).json({message: "Post Deleted"});
    });
    
});

router.put('/api/posts/:id', (req, res, next)=> {
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

router.get('/api/posts',(req, res, next )=> {
 
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


router.get('/api/posts/:id', (req, res, next)=> {
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

module.exports = router;