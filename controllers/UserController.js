import { validationResult } from "express-validator/src/validation-result.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import UserModal from '../models/User.js';
import User from "../models/User.js";

export const getMe = async (req, res) => { 
    try {
        const user = await UserModal.findById(req.userId)
        res.json(user)
    } catch (error) {
        console.log('error auth me: ', error)
    }
}


export const register =  async (req, res) => {

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

        console.log({newUser, token})
        const {passwordHash,  ...userData} = newUser._doc

        res.json({success: true, ...userData, token})
    } catch (err) {
        res.status(500).json({
            message: 'Shit, some errors here: ' + err
        })
    }

}


export const login = async (req, res) => {
    try {
        const user = await UserModal.findOne({email: req.body.email})

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
        }, 'secret123', {
            expiresIn: '30d'
        })

        res.status(200).json({
            message: `Welcome, ${user._id}`,
            token
        })
    } catch (err) {
        console.log('login error: ', err)
    }
}