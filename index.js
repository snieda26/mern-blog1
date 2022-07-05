import express, { application } from "express";
import mongoose from 'mongoose';
import {registerValidation, loginValidation, postCreateValidation} from './validations/validations.js';
import {checkAuth, handleValidationErrors} from './utils/index.js'
import multer from "multer";
// import dotenv from 'dotenv';


import { UserController, PostController } from './controllers/index.js';


// dotenv.config({ path: './config.env' })
mongoose.connect("mongodb+srv://testmern:testmern123@cluster0.ngeu9.mongodb.net/blog?retryWrites=true&w=majority")
    .then(res => {
        console.log('DB conneted');
    }).catch(err => console.log(err));



const app = express();

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
      cb(null, './uploads');
    },
    filename: (_, file, cb) => {
      cb(null, file.originalname);
    },
  });

const upload = multer({storage})
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
    res.send('Hello , World!');
})

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login )
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register)
app.get('/auth/me', checkAuth, UserController.getMe)

app.post('/uploads', checkAuth, upload.single('image'), (req, res) => {
    res.json({
      url: `/uploads/${req.file.originalname}`,
    });
});

app.get('/posts', PostController.getAll)
app.get('/posts/:id', PostController.getOne)
app.delete('/posts/:id',checkAuth, PostController.remove)
app.patch('/posts/:id',checkAuth, PostController.update)
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.createPost);


 

app.listen(3001, (err) => {
    if(err) {
        console.log(err)
    }

    console.log('server started on port:', 3000)
})