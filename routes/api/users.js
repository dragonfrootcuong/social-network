const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const config = require('config');


// @route    POST api/users
// @desc     Register User
// @access   Publish
router.post('/',[
    check('name', 'Name is required.').not().isEmpty(),
    check('email', 'Email is not valid').isEmail(),
    check('password', 'Please enter a password with 6 or more characters')
        .isLength({min: 6})
],
 async (req, res) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
         return res.status(400).json({errors: errors.array()});
     }

     try {
        // Check user is exist
        const {name, email, password} = req.body;
        let user = await User.findOne({email});
        if (user) {
            return res.status(400).json({errors: [{msg: 'User already exists'}]});
        }
         const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
         });
         user = new User({
            name,
            email,
            password,
            avatar
         });
         
         const salt = await bcrypt.genSalt(10);
         user.password = await bcrypt.hash(password, salt);
         await user.save();
         return res.json({status: config.get('UserRegister_Success'), message: "Saved User"})
     } catch(err) {
        console.log(err.message);
        return res.status(500).json('Server Error');
     }
});

module.exports = router;