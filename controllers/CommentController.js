import CommentModel from '../models/Comment.js';

export const getCommentsForSelectedPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const comments = await CommentModel.find({post: postId}).sort({'createdAt': 1}).populate('user').exec();

        res.json(comments);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Did not succeed in getting selected comments',
        });
    }
};

export const getLastComments = async (req, res) => {
    try {
        const comments = await CommentModel.find().sort({'createdAt': -1}).populate('user').limit(10).exec();

        res.json(comments);
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: 'Did not succeed in getting comments',
        });
    }
};

export const create = async (req, res) => {
    try {
        const doc = new CommentModel({
            text: req.body.text,
            post: req.body.post,
            user: req.userId
        });

        const comment = await doc.save();

        res.json(comment);
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: 'Did not succeed in creating comment',
        });
    }
};

export const update = async (req, res) => {
    try {
        const commentId = req.params.id;

        await CommentModel.updateOne(
            {
                _id: commentId
            },
            {
                text: req.body.text,
            });

        res.json({
            success: true
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: 'Did not succeed in updating this comment',
        });
    }
};

export const remove = async (req, res) => {
    try {
        const commentId = req.params.id;

        CommentModel.findOneAndDelete({
            _id: commentId,
        }, (err, doc) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: 'Did not succeed in deleting a comment',
                });
            }

            if (!doc) {
                console.log(err);
                return res.status(404).json({
                    message: 'Selected comment not found',
                });
            }

            res.json({
                success: true
            });
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: 'Selected comment not found',
        });
    }
};
