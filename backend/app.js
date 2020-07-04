const express = require('express');
const bodyParser = require('body-parser');
const { createModuleResolutionCache } = require('typescript');

const app = express();

app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next)=> {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods","GET, POST, PATCH, DELETE, OPTIONS");
    next();
});

app.post('/api/posts', (req, res, next)=> {
    const post = req.body;

    console.log(post);

    res.status(201).json(
        {message: "Your post has been added"}
    );
});

app.get('/api/posts',(req, res, next )=> {
  const posts = [
    {
        id: "akaslfkflak",
        title: "First Post",
        content: "This is a first post"
    },
    {
        id: "sakfjbasjb",
        title: "Second Post",
        content: "This is a second post"
    }
    ];

    res.status(200).json({
        message: "Posts fetched successfully",
        posts: posts
    });
});

app.use('/',(req, res)=> {
    console.log('Second middleware');
    res.send('Hello from root');
});

module.exports = app;
