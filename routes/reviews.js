const express = require('express');
const route = express.Router({mergeParams:true});
let {reviewSchema} = require('../schema.js');
const wrapAsync = require('../utils/wrapAsync.js');
const ExceptionErr = require('../utils/ExceptionErr.js');
const Listing = require('../models/listing.js');
const Review = require('../models/reviews.js');
const { isLoggedIn, isAuthor } = require('../middleware.js');
const reviewController = require('../controller/reviews.js');

const validateReview = (req,res,next)=> {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        throw new ExceptionErr(400,error);
    }
    next();
}

//post route
route.post('/',isLoggedIn,validateReview,wrapAsync(reviewController.createNewReview));
//delete route
route.delete('/:reviewId',isAuthor,wrapAsync(reviewController.destroyReview));

module.exports = route;