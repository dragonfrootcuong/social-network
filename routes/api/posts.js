const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Post = require('../../models/Post'); 
const AuthMid = require('../../middleware/auth');
const User = require('../../models/User');

// @route    GET api/posts
// @desc     Get all post
// @access   private
router.get('/', AuthMid, async (req, res) => {
    try{
        const posts = await Post.find().sort({date: -1});
        res.json(posts);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    GET api/posts/:id
// @desc     Get post by id
// @access   private
router.get('/:id', AuthMid, async (req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).send('Post Not Found');
        }

        return res.json(post);
        res.json(posts);
    } catch(err) {
        if (err.kind === 'ObjectId') {
            return res.status(400).json({msg: 'Post not found'});
        }
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    Delete api/posts/:id
// @desc     Delete post by id
// @access   private
router.delete('/:id', AuthMid, async (req, res) => {
    try{
        const post  = await Post.findById(req.params.id);
        if (!post) {
            return res.status(400).send("Post no longer exist");
        }

        if (post.user.toString() !== req.user.id) return res.status(400).send('You do not authorize');
        await post.deleteOne();
        res.json({msg: 'Deleted'});
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    Post api/posts
// @desc     Add Post
// @access   private
router.post('/', [AuthMid, [
    check('text', 'Text is required').not().isEmpty()
]], async (req, res) =>  {
    const error = validationResult(req);
    if(!error.isEmpty()) return res.status(400).json({msg: error.array()});
    const userId = req.user.id;
    try{
        const userObject = await User.findById(userId).select('-password');
        if (!userObject) return res.status(400).send('User is no longer exist');
        const newPost = new Post({
            text: req.body.text,
            user: userObject.id,
            name: userObject.name,
            avatar: userObject.avatar
        });
        await newPost.save();
        return res.json(newPost);
    } catch (err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
module.exports = router;