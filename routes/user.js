const express = require('express');
const wrapAsync = require('../utils/wrapAsync.js');
const User = require('../models/user.js');
const passport = require('passport');
const { redirectUrl } = require('../middleware.js');
const router = express.Router();
const userController = require('../controller/user.js');
const listingController = require('../controller/listing.js');

router.route('/signup')
    .get(userController.signUpForm) 
    .post(wrapAsync(userController.signUp));

router.route('/login')
     .get(userController.loginForm)
     .post(redirectUrl,passport.authenticate('local',{failureRedirect:'/login',failureFlash:true}),userController.login);

router.get('/logout',userController.logout);
router.get('/',wrapAsync(listingController.index));

module.exports = router;