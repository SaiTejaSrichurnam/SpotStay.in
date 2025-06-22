const User = require('../models/user');

module.exports.signUpForm = (req,res) => {
     res.render("user/signup.ejs");
}
module.exports.signUp = async(req,res) => {
    try{
        let {username,email,password} = req.body;
        let newUser = new User({email,username});
        let registeredUser = await User.register(newUser,password);
        req.login(registeredUser,(err) =>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to Wanderlust!");
            res.redirect('/listings');
        })
    }catch(e){
        req.flash("error",e.message);
        res.redirect('/signup');
    }
}
module.exports.loginForm = (req,res) => {
    res.render('user/login.ejs');
}
module.exports.login = (req,res) => {
    req.flash("success","Welcome Back to Wanderlust!")
    let redirectUrl =res.locals.redirectUrl || '/listings';
    res.redirect(redirectUrl);
}
module.exports.logout = (req,res,next) => {
    req.logout((err) => {
        if(err){
            return next(err);
        }
        req.flash("success","You logged out successfully!");
        res.redirect('/listings');
    })
}