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

// @route    PUT api/posts/like/:id
// @desc     Add Like Post
// @access   private

router.put('/like/:id', AuthMid, async (req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(400).send('Post is no longer exist');
        if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0){
            return res.status(400).send('Post is liked by this user');
        }
        post.likes.unshift({user: req.user.id});
        await post.save();
        return res.json(post);
    } catch(err) {
        if (err.kind == 'ObjectId') {
            return res.status(400).send('Post is no longer exist');
        }
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route    PUT api/posts/unlike/:id
// @desc     UnLike Post
// @access   private
router.put('/unlike/:id', AuthMid, async (req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(400).send('Post is no longer exist');
        if (post.likes.length < 1){
            return res.status(400).send('Post is no like');
        }
        const unlikeIndex = post.likes.map(like => like.user).indexOf(req.user.id);
        if (unlikeIndex >= 0) {
            post.likes.splice(unlikeIndex, 1);
            await post.save();
            return res.json(post);    
        } else {
            return res.status(400).send('This user is not like this post ');
        }
        
    } catch(err) {
        if (err.kind == 'ObjectId') {
            return res.status(400).send('Post is no longer exist');
        }
        console.error(err);
        res.status(500).send('Server error');
    }
});

// @route    PUT api/posts/comment/:id
// @desc     Add Comment to Post
// @access   private

router.put('/comment/:id', [AuthMid, [
    check('text', 'Text is required').not().isEmpty()
]], async (req, res) => {
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.status(400).json({error: errors.array()});
        }
        const post = await Post.findById(req.params.id);
        const user = User.findById(req.user.id).select('-password');
        if(!user) return res.status(400).send('User is no longer exist');
        if (!post) return res.status(400).send('Post is no longer exist');
        const newComment = {
            user: req.user.id,
            text: req.body.text,
            name: user.name,
            avatar: user.avatar
        };
        post.comments.unshift(newComment);
        await post.save();
        return res.json(post);
    } catch(err) {
        if (err.kind == 'ObjectId') {
            return res.status(400).send('Post is no longer exist');
        }
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route    PUT api/posts/comment/:id/:comment_id
// @desc     remove comment
// @access   private
router.delete('/comment/:id/:comment_id', AuthMid, async (req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(400).send('Post is no longer exist');
        if (post.comments.length < 1) return res.status(400).send('Post is no any comment');
        const indexComment = post.comments.map(comment => comment.id).indexOf(req.params.comment_id);
        await post.comments.splice(indexComment, 1);
        await post.save();
        res.json(post);
    }catch(err){
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;