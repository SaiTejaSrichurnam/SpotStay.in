const express = require('express');
const router = express.Router();
const Listing = require('../models/listing.js');
const wrapAsync = require('../utils/wrapAsync.js');
const ExceptionErr = require('../utils/ExceptionErr.js');
let {listingSchema} = require('../schema.js');
const { isLoggedIn, isOwner } = require('../middleware.js');
const listingController = require('../controller/listing.js');
const {storage} = require('../CloudConfig.js');
const multer = require('multer');
const upload = multer({storage});
//validator
const validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        throw new ExceptionErr(400,error);
    }
    next();
}

router.route('/')
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn,upload.single("listing[image]"),validateListing,wrapAsync(listingController.createNewListing));

//new
router.get('/new',isLoggedIn,listingController.shownewForm);

router.route('/:id')
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn,upload.single("listing[image]"),isOwner,validateListing,wrapAsync(listingController.updateListing))
    .delete(isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));


router.get('/:id/edit',isLoggedIn,isOwner,wrapAsync(listingController.getEditForm));


module.exports = router;