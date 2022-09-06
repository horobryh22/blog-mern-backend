import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import {validationResult} from 'express-validator';

import {registerValidation} from './validations/auth.js';
import checkAuth from './utils/checkAuth.js';

import UserModel from './models/User.js';

mongoose.connect('mongodb+srv://horobryh22:549549ab@cluster0.dfnxtha.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => console.log('DB ok!'))
    .catch((err) => console.log('DB error', err));

const app = express();

app.use(express.json());

app.get('/auth/me', checkAuth, async (req, res) => {
    try {

        const user = await UserModel.findById(req.userId);

        if (!user) {
            res.status(404).json({
                message: 'User not found'
            })
        }

        const {passwordHash, ...userData} = user._doc;

        res.json(userData);

    } catch (e) {
        console.log(e);
        res.status(403).json({
            message: 'You do not have an access',
        });
    }
})

app.post('/auth/login', async(req, res) => {
    try {

        const user = await UserModel.findOne({email: req.body.email});

        if (!user) {
            res.status(404).json({
                message: 'User not found',
            })
        }

        const isValidPassword = await bcrypt.compare(req.body.password, user._doc.passwordHash);

        if (!isValidPassword) {
            res.status(400).json({
                message: 'Invalid login or password',
            })
        }

        const token = jwt.sign(
            {
                _id: user._id,
            },
            'secret',
            {
                expiresIn: '30d'
            }
        )

        const {passwordHash, ...userData} = user._doc;

        res.json({...userData, token});

    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: 'You were not authorized',
        });
    }
})

app.post('/auth/register', registerValidation, async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const doc = new UserModel({
            email: req.body.email,
            passwordHash: hash,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl
        })

        const user = await doc.save();

        const token = jwt.sign(
            {
                _id: user._id,
            },
            'secret',
            {
                expiresIn: '30d'
            }
        )

        const {passwordHash, ...userData} = user._doc;

        res.json({...userData, token});
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: 'You were not registered',
        });
    }
})

app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log('Server OK');
})