import {body} from 'express-validator'

export const registerValidation = [
    body('email', 'invalid email').isEmail(),
    body('password', 'Password must contains minimum 5 symbols').isLength({min: 5}),
    body('fullName', 'Your fullname must contains minimum 3 symbols').isLength({min: 3}),
    body('avatarUrl', 'invalid url').optional().isURL()
]