const express = require('express');
const multer = require('multer');
const Post = require('../models/post');

const router = express.Router();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "backend/images");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname.toLowerCase().replace(' ','-')) ;
    }
});


router.post('/api/posts', multer({storage}).single('image') , (req, res, next)=> {
    const url = req.protocol + "://" + req.get("host");
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/images/" + req.file.filename 
    });
    post.save().then((result)=>{
        res.status(201).json(
            {   message: "Your post has been added", 
                post: {
                    id: result._id,
                    title: result.post,
                    content: result.content,
                    imagePath: result.imagePath
                }
            }
    )});
});



router.delete('/api/posts/:id', (req, res, next)=> {
    console.log(req.params.id);
    Post.deleteOne({_id: req.params.id}).then( result=>{
        console.log(result);
        res.status(200).json({message: "Post Deleted"});
    });
    
});

router.put('/api/posts/:id', multer({storage}).single('image'),  (req, res, next)=> {
    const url = req.protocol + "://" + req.get("host");
    var imageUrl = null;
    if (req.file === undefined) {
        imageUrl = req.body.imagePath;
    }
    else{
        imageUrl =  url + "/images/" + req.file.filename ;
    }
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imageUrl
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
            res.status(200).json({id: post._id, title: post.title, content: post.content,imagePath: post.imagePath}); 
        }
        else {
            res.status(404).json({message: "Post not found"});
        }
    });
});

module.exports = router;