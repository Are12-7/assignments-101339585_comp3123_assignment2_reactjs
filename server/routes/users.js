const express = require('express');
const UserModel = require('../models/User');
const Authenticate = require('../middleware/Authenticate');
var jwt = require('jsonwebtoken');
const router = express.Router();
const bcryptjs = require('bcryptjs');

// REGISTER
router.post('/register', async (req, res) => {
    try {
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;

        const newUser = new UserModel({
            username: username,
            email: email,
            password: password
        });
        
        //Create User
        const created = await newUser.save();
        console.log(created);
        res.status(201).send(newUser)
    } catch (error) {
        res.status(500).send({message: 'Error While Creating User'})
        
    }
})

//LOG-IN
router.post('/login', async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        //Find User if exist
        const user = await UserModel.findOne({ email: email });
        if (user) {
            //Verify User
            const isMatch = await bcryptjs.compare(password, user.password);

            if (isMatch) {
                //Generate Token
                const token = await user.generateToken();
                res.cookie('jwt', token, {
                    //Will expire in 24 hours
                    expires: new Date(Date.now() + 86400000),
                    httpOnly : true
                })
                res.status(200).send('User logged in successfully')
            } else {
                res.status(400).send('Invalid Credentials');
            }
        }else {
            res.status(400).send('Invalid Credentials');
        }
        //
    } catch (error) {
        res.status(400).send(error);
        
    }
});

//Logout
router.get('/logout', (req, res) => {
    res.clearCookie('jwt', { path: '/login' })
    res.status(200).send('User Logged Out')
})

//Authentication
router.get('/auth', Authenticate, (req, res) => {
    
})
module.exports = router;