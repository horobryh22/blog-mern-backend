import express from 'express';
import fs from 'fs';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';

import {
    registerValidation,
    loginValidation,
    postCreateValidation,
    commentCreateValidation
} from './validations/validations.js';

import {PostController, UserController, CommentController} from './controllers/index.js';
import {checkAuth, handleValidationErrors} from './utils/index.js';

mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://horobryh22:549549ab@cluster0.dfnxtha.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => console.log('DB ok!'))
    .catch((err) => console.log('DB error', err));

const app = express();

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        if (!fs.existsSync('uploads')) {
            fs.mkdirSync('uploads')
        }
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({storage});

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

//test
app.get('/', (req, res) => {
    res.send('Server working!')
});
//auth
app.get('/auth/me', checkAuth, UserController.getMe);
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
//upload
app.post('/upload', upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
});
//comments
app.get('/comments', CommentController.getLastComments);
app.get('/comments/:id', CommentController.getCommentsForSelectedPost);
app.post('/comments', checkAuth, commentCreateValidation, handleValidationErrors, CommentController.create);
app.delete('/comments/:id', checkAuth, CommentController.remove);
app.patch('/comments/:id', checkAuth, commentCreateValidation, handleValidationErrors, CommentController.update);
//tags
app.get('/tags', PostController.getLastTags);
//posts
app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update);

app.listen( process.env.PORT || 4444, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log('Server OK');
})