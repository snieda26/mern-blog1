import express, { application } from "express";
import mongoose from 'mongoose';
import {registerValidation} from './validations/validations.js';
import checkAuth from "./utils/checkAuth.js";
// import dotenv from 'dotenv';

import { UserController, PostController } from './controllers/index.js';


// dotenv.config({ path: './config.env' })
mongoose.connect(process.env.DATABASE_URL)
    .then(res => {
        console.log('DB conneted');
    }).catch(err => console.log(err));

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello , World!');
})

app.post('/auth/login', UserController.login )

app.post('/auth/register', registerValidation,UserController.register)

app.get('/auth/me', checkAuth, UserController.getMe)

app.post('/posts', PostController.createPost)
app.get('/posts', PostController.getAll)
app.get('/posts/:id', PostController.getOne)



app.listen(3001, (err) => {
    if(err) {
        console.log(err)
    }

    console.log('server started on port:', 3000)
})