const express = require('express');
const authMid = require('../../middleware/auth');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const config = require('config');
const jwtToken = require('jsonwebtoken');

const router = express.Router();
// @route    GET api/auth
// @desc     Test route
// @access   Publish
router.get('/',authMid, async (req, res) => {
    try{
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/auth
// @desc    Test route
// @access  Publish

router.post('/',[
    check('email', 'Email is not valid').isEmail(),
    check('password', 'Please enter a password')
        .not().isEmpty()
],
 async (req, res) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
         return res.status(400).json({errors: errors.array()});
     }

     try {
        // Check user is exist
        const {email, password} = req.body;
        let user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({errors: [{msg: 'Invalid Credentials'}]});
        }
        
        const isMatch = bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({errors: [{msg: 'Invalid Credentials'}]});
        }
        const payload = {
             user: {
                 id: user.id
             }
         }
         jwtToken.sign(
             payload,
             config.get('jwtSecret'),
             { expiresIn: 360000},
             (err, token) => {
                if (err) {
                    throw err;
                }
                return res.json({status: config.get('UserRegister_Success'), message: "Login Success", token: token})
                
             })
         
     } catch(err) {
        console.log(err.message);
        return res.status(500).json('Server Error');
     }
});

module.exports = router;