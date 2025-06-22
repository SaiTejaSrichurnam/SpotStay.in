const Listing = require("./models/listing");
const Review = require("./models/reviews");
module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","User must be loggedIn");
        return res.redirect('/login');
    }
    next();
}
module.exports.redirectUrl = (req,res,next) => {
    res.locals.redirectUrl = req.session.redirectUrl;
    next();
}
module.exports.isOwner = async (req,res,next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!req.user._id.equals(listing.owner._id)){
         req.flash("error","You have no Access!");
         return res.redirect(`/listings/${id}`);
    }
    next();
}
module.exports.isAuthor = async(req,res,next) => {
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(res.locals.currUser && res.locals.currUser._id.equals(review.author._id)){
        next();
    }else{
         req.flash("error","You have no Access!");
         return res.redirect(`/listings/${id}`);
    }
}