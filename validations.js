import {body} from 'express-validator';

export const loginValidation = [
    body('email', 'Incorrect format of email').isEmail(),
    body('password', 'Password should be min 5 symbols').isLength({min: 5}),
];

export const registerValidation = [
    body('email', 'Incorrect format of email').isEmail(),
    body('password', 'Password should be min 5 symbols').isLength({min: 5}),
    body('fullName', 'Enter your name').isLength({min: 3}),
    body('avatarUrl', 'Invalid avatar link').optional().isURL(),
];

export const postCreateValidation = [
    body('title', 'Enter the title of article').isLength({min: 3}).isString(),
    body('text', 'Enter the description of article').isLength({min: 3}).isString(),
    body('tags', 'Incorrect data format').optional().isArray(),
    body('imageUrl', 'Invalid image link').optional().isString(),
]