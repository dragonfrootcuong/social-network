const express = require('express');
const authMid = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator');
const router = express.Router();

// @route    GET api/profile/me
// @desc     Test route
// @access   Publish
router.get('/me', authMid, async (req, res) => {
    try{
        const profile = await Profile.findOne({user: req.user.id}).populate(
            'user',
            ['name', 'avatar']);
        if (!profile) {
            return res.status(400).json({msg: 'There is no profile for this user'});
        }
        
        return res.json(profile);
    } catch(err) {
        console.log(err);
        res.status(500).json('Server Error');
    }
});

// @route    POST api/profile/me
// @desc     Create or update user profile
// @access   Publish

router.post('/',[authMid, [
    check('status', 'Status is required.').not().isEmpty(),
    check('skills', 'Skills is required').not().isEmpty(),
]],
 async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills, 
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin
    } = req.body;
    const profileField = {};
    profileField.user = req.user.id;
    if(company) profileField.company = company;
    if(website) profileField.website = website;
    if(location) profileField.location = location;
    if(bio) profileField.bio = bio;
    if(status) profileField.status = status;
    if(githubusername) profileField.githubusername = githubusername;
    if(skills){
        profileField.skills = skills.split(', ').map(skill => skill.trim());
    }

    profileField.social = {};
    if(youtube) profileField.social.youtube = youtube;
    if(facebook) profileField.social.facebook = facebook;
    if(twitter) profileField.social.twitter = twitter;
    if(instagram) profileField.instagram = instagram;
    if(linkedin) profileField.linkedin = linkedin;
    try{
        let profile = await Profile.findOneAndUpdate({user: profileField.user}, profileField,{new: true});
        if (!profile) {
            profile = new Profile(profileField);
            profile.save();
        }
        return res.json(profile);
    } catch(err){
        console.error(err.message);
        return res.status(500).send('Server Error');
    }
});

// @route   Get api/profile
// @desc    Get all profile
// @access  Public
router.get('/', async (req, res) => {
    try{
        const profile = await Profile.find().populate(
            'user',
            ['name', 'avatar']);
        if (!profile) {
            return res.status(400).json({msg: 'There is no profile'});
        }
        
        return res.json(profile);
    } catch(err) {
        console.log(err);
        res.status(500).json('Server Error');
    }
});

router.get('/user/:user_id', async (req, res) => {
    try{
        const profile = await Profile.findOne({user: req.params.user_id}).populate(
            'user',
            ['name', 'avatar']);
        if (!profile) {
            return res.status(400).json({msg: 'There is no profile'});
        }
        
        return res.json(profile);
    } catch(err) {
        if (err.kind === 'ObjectId') {
            return res.status(400).json({msg: 'There is no profile'});
        }
        console.log(err);
        res.status(500).json('Server Error');
    }
});

// @route   Delete api/profile
// @desc    Delete profile and user
// @access  private

router.delete('/', async (req, res) => {
    try{
        await Profile.findOneAndDelete({user: req.body.user_id});
        await User.findOneAndDelete({_id: req.body.user_id});
        return res.json({msg: "Deleted profile and user"});
    } catch(err) {
        console.log(err);
        res.status(500).json('Server Error');
    }
});

// @route   Put api/profile/experience
// @desc    add experience
// @access  private

router.put('/experience', [authMid, [
    check('title', 'Title is required').not().isEmpty(),
    check('company', 'Company is required'). not().isEmpty(),
    check('from', 'From is required').not().isEmpty()
]], async (req, res) => { 
    const errors = validationResult(req);
    if(!errors.isEmpty) {
        return res.status(400).json({errors: errors.array()});
    }
    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    } = req.body;
    const newExperience = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    };
    try{
       const profile = await Profile.findOne({user: req.user.id});
       if (!profile) {
           return res.status(400).json({msg: "No profile for user"});
       }

       profile.experience.unshift(newExperience);
       await profile.save();
       res.json({msg: "Add experience success"});
    } catch(err) {
        console.log(err);
        res.status(500).json('Server Error');
    }
});


module.exports = router;