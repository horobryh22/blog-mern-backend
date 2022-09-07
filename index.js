import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';

import {
    registerValidation,
    loginValidation,
    postCreateValidation
} from './validations.js';

import {PostController, UserController} from './controllers/index.js';
import {checkAuth, handleValidationErrors} from './utils/index.js';


mongoose.connect('mongodb+srv://horobryh22:549549ab@cluster0.dfnxtha.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => console.log('DB ok!'))
    .catch((err) => console.log('DB error', err));

const app = express();

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({storage});

app.use(express.json());
app.use('/upload', express.static('uploads')); //if we need to get files from static folders, we say express to it doesn't accept this path                                                     //like get request

app.get('/auth/me', checkAuth, UserController.getMe);
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `uploads/${req.file.originalname}`
    })
});

app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update);

app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log('Server OK');
})