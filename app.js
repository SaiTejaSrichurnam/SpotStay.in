require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const engine = require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync.js');
const ExceptionErr = require('./utils/ExceptionErr.js');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');
const app = express();
//process.env.Mongo_DB_URL;
const dbUrl = "mongodb+srv://SaiTeja:5nvDgPZwsoBYZAxf@cluster0.kggdost.mongodb.net/";

main().
then(res => {console.log('connection successful')})
.catch(err => console.log("this is the error",err));

async function main() {
  await mongoose.connect(dbUrl);
}

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter:24*3600,
});

store.on("errpr",() => console.log("Error on DB",err));

let sessionOptions = {
    store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now()+7*24*60*60*1000,
        maxAge : 7*24*60*60*1000,
        httpOnly : true,
    }
}

app.engine('ejs',engine);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'/views'));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'/public')));
app.use(express.json());

app.use(flash());
app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


const listingRoute = require('./routes/listing.js');
const reviewsRoute = require('./routes/reviews.js');
const userRoute = require('./routes/user.js');

app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})
//problem
app.use('/listings',listingRoute);
app.use('/listings/:id/reviews',reviewsRoute);
app.use('/',userRoute);

app.all(/.*/,(req,res,next) => {
    next(new ExceptionErr(404,'Page Not found'));
});

app.use((err,req,res,next) => {
    let{statusCode = 500,message="Something went wrong"} = err;
    res.status(statusCode).render('Error.ejs',{statusCode,message});
})

app.listen(8080,() => {
    console.log('server is running..');
})