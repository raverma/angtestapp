const express = require('express');

const app = express();

app.use((req, res, next)=> {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Header", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods","GET, POST, PATCH, DELETE, OPTIONS");
    next();
});

app.use('/api/posts',(req, res, next )=> {
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

    res.status(200).json(posts);
});

app.use('/',(req, res)=> {
    console.log('Second middleware');
    res.send('Hello from root');
});

module.exports = app;
