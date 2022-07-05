import {body} from 'express-validator'

export const registerValidation = [
    body('email', 'Invalid email').isEmail(),
    body('password', 'Password must contains minimum 5 symbols').isLength({min: 5}),
    body('fullName', 'Your fullname must contains minimum 3 symbols').isLength({min: 3}),
    body('avatarUrl', 'invalid url').optional().isURL()
]


export const loginValidation = [
    body('email', 'Invalid email').isEmail(),
    body('password', 'Password must contains minimum 5 symbols').isLength({min: 5})
]


export const postCreateValidation = [
    body('title', 'Please, enter title').isLength({ min: 3 }).isString(),
    body('text', 'Please, enter text ').isLength({ min: 3 }).isString(),
    body('tags', 'Invalid tags format').optional().isString(),
    body('imageUrl', 'Invalid URL').optional().isString(),
  ];