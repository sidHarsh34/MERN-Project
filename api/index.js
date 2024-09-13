import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

mongoose.connect("mongodb://localhost:27017/mern-auth").then(() =>{
    console.log('Connect to mongodb');
})
.catch((err) => {
    console.log(err);
});

const app = express();

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});