require('dotenv').config();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var mongoose = require("mongoose");
var flash = require("connect-flash");
var passport = require('passport');
var LocalStrategy = require('passport-local');
var methodOverride = require('method-override');
var Campground = require('./models/campground');
var Comment = require('./models/comment');
var User = require('./models/user');
var expressSession = require('express-session');
var seedDB = require('./seeds');

// Requiring Routes
var campgroundRoutes = require('./routes/campgrounds');
var commentRoutes = require('./routes/comments');
var indexRoutes = require('./routes/index');

const port = process.env.PORT || 3000;

const url = process.env.DATABASEURL || "mongodb://localhost:27017/yelp_camp";
// mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true});
// mongodb+srv://bebeto:satyaki@1998@cluster0-2wmif.mongodb.net/yelpcamp?retryWrites=true&w=majority
mongoose.connect(url, {
       useNewUrlParser: true,
       useCreateIndex: true
}).then(() => {
       console.log("Connected to DB!");
}).catch(err => {
       console.log(err.message);
});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();        //Seed the database
app.locals.moment = require("moment");

//PASSPORT CONFIG
app.use(expressSession({
       secret: 'This is the secret message',
       resave: false,
       saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
       res.locals.currentUser = req.user;
       res.locals.error = req.flash("error");
       res.locals.success = req.flash("success");
       next();
});
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

// Campground.create({
//        name: 'Granite Hill',
//        image: 'https://images.unsplash.com/photo-1542067519-6cd1e217df2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80',
//        description: "a hill full of granite stones ,beautiful view from hill top."
// }, (err, campground) => {
//        if (err) {
//               console.log(err)
//        } else {
//               console.log("New campground created!");
//               console.log(campground);
//        }
// });

app.listen(port, () => {
       console.log("The YelpCamp server has started!!");
})