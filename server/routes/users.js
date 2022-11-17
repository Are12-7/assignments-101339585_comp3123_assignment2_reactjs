const express = require('express');
const UserModel = require('../models/User');
const { check } = require('express-validator');
const {validationResult} = require('express-validator');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
const router = express.Router();

// SIGN-UP
router.post('/signup', [
    //validate user input
    check('username', 'Username should be at least 3 characters').isLength({ min: 3 }),
    check('email', 'Email should be valid').isEmail(),
    check('password', 'Password should be at least 6 characters').isLength({ min: 6 })   
], async (req, res) => {
    const errors = validationResult(req);
    //Checking user input 
    if(!errors.isEmpty()){ return res.status(400).send({error: errors.array()[0].msg})}
    const newUser = new UserModel(req.body);
    //If there's no errors, create a new user
    try {
        await newUser.save();
        res.status(201).send(newUser);
        
    } catch (error) {
        res.status(500).send({ message: 'Error while creating user  ' });        
    }
});

//LOG-IN
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    UserModel.findOne({ username }, (error, user) => {
        if (error || !user)
            return res.status(500).json({ error: 'Username was not found' });
        
            // Authenticate User
        if (!user.authenticate(password))
            return res.status(500).json({ status:'false', message: "Invalid Username and password" });
        
            //Create Token
            const token = jwt.sign({ _id: user._id }, process.env.SECRET);

            //Token in cookie
            res.cookie('token', token, { expire: new Date() + 1 });
            
            //Response
            const {_id, username,email} = user
            return res.json({
                user: {
                    _id,
                    status: 'true',
                    username,
                    email,
                    message: 'User logged in successfully',
                    token
                }
            })
        })
});



module.exports = router;