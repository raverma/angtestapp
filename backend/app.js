const express = require('express');

const app = express();

app.use((req, res)=> {
    console.log('First middleware');
    next();
});

app.use((req, res)=> {
    console.log('Second middleware');
    res.send('Hello from server');
});

module.exports = app;
