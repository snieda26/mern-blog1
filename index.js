import express from "express";
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { validationResult } from "express-validator/src/validation-result.js";
import bcrypt from 'bcrypt';
import {registerValidation} from './validations/auth.js';
import UserModal from './models/User.js';
import User from "./models/User.js";

mongoose.connect('mongodb+srv://testmern:testmern123@cluster0.ngeu9.mongodb.net/blog?retryWrites=true&w=majority')
    .then(res => {
        console.log('DB conneted');
    }).catch(err => console.log(err));

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello , World!');
})

app.post('/auth/login', async (req, res) => {
    try {
        const user = await  UserModal.findOne({email: req.body.email})

        if(!user) {
            return res.status(404).json({
                message: 'User not found, please try again next life'
            })
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash)
        console.log(isValidPass)
        if(!isValidPass) {
            return res.status(404).json({
                message: 'User not found, please try again next life'
            })
        }

        const token = jwt.sign({
            _id: user._id
        }, 'secret12', {
            expiresIn: '30d'
        })

        res.status(200).json({
            message: `Welcome, ${user._id}`
        })
    } catch (err) {

    }
})

app.post('/auth/register', registerValidation, async (req, res) => {

    try {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        const {password} = req.body;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const doc = new UserModal ({
            fullName: req.body.fullName,
            email: req.body.email,
            passwordHash: hash
        })

        const newUser = await doc.save()

        const token = jwt.sign({
            _id: User._id
        }, 'secret12', {
            expiresIn: '30d'
        })

        console.log(newUser)
        const {passwordHash,  ...userData} = newUser._doc

        res.json({success: true, ...userData, token})
    } catch (err) {
        res.status(500).json({
            message: 'Shit, some errors here: ' + err
        })
    }

})



app.listen(3001, (err) => {
    if(err) {
        console.log(err)
    }

    console.log('server started on port:', 3000)
})