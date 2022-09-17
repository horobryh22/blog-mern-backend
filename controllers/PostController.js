import PostModel from '../models/Post.js';


export const getLastTags = async (req, res) => {
    try {
        const posts = await PostModel.find().limit(5).exec();

        const tags = posts.map(post => post.tags).flat().slice(0, 5)

        res.json(tags);
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: 'Did not succeed in getting tags',
        });
    }
}

export const getAll = async (req, res) => {
    try {
        const sort = req.headers.sort;
        const posts = await PostModel.find().sort({[sort]: -1}).populate('user').exec();
        const count = await PostModel.count();

        res.json({posts, postsTotalCount: count});
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: 'Did not succeed in getting an articles',
        });
    }
};

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;

        PostModel.findOneAndUpdate(
            {
                _id: postId,
            },
            {
                $inc: { viewsCount: 1 },
            },
            {
                returnDocument: 'after',
            },
            (err, doc) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message: 'Did not succeed in getting article',
                    });
                }

                if (!doc) {
                    return res.status(404).json({
                        message: 'The article not found',
                    });
                }

                res.json(doc);
            },
        ).populate('user');
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Did not succeed in getting articles',
        });
    }
};



export const remove = async (req, res) => {
    try {
        const postId = req.params.id;

        PostModel.findOneAndDelete({
            _id: postId,
        }, (err, doc) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: 'Did not succeed in deleting an article',
                });
            }

            if (!doc) {
                console.log(err);
                return res.status(404).json({
                    message: 'Article not found',
                });
            }

            res.json({
                success: true
            });
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: 'Article not found',
        });
    }
};

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId
        });

        const post = await doc.save();

        res.json(post);
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: 'Did not succeed in creating an article',
        });
    }
};

export const update = async (req, res) => {
    try {
        const postId = req.params.id;

        await PostModel.updateOne(
            {
                _id: postId
            },
            {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                tags: req.body.tags,
            });

        res.json({
            success: true
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: 'Did not succeed in updating an article',
        });
    }
};