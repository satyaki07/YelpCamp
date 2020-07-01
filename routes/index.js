var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var Campground = require('../models/campground');

// Root route
router.get("/", (req, res) => {
    res.render("landing");
})

// Show registration form
router.get("/register", (req, res) => {
    res.render("register", {page: 'register'});
});

// Signup logic route
router.post("/register", (req, res) => {
    var newUser = new User({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        avatar: req.body.avatar
    });
    User.register(newUser, req.body.password, function(err, user) {
           if (err) {
                  req.flash("error", err.message); 
                  return res.redirect("/register");
           }
           passport.authenticate("local")(req, res, function() {
               req.flash("success", "Welcome to YelpCamp " + user.username); 
                  res.redirect("/campgrounds");
           });
    });
});

// Show login form
router.get("/login", (req, res) => {
    res.render("login", {page: 'login'});
})

// Login logic route
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
    }), (req, res) => {         
});

// Logout route
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "Logged you out !");
    res.redirect("/campgrounds"); 
})

//User Profile
router.get("/users/:id", (req, res) => {
    User.findById(req.params.id, function(err, foundUser) {
        if (err) {
            req.flash("error", "Something went wrong!");
            return res.redirect("/");
        } 
        Campground.find().where('author.id').equals(foundUser._id).exec(function(err, campgrounds) {
            if (err) {
                req.flash("err", "Something went wrong!");
                return res.redirect("/");
            }
            res.render("users/show", {user: foundUser, campgrounds});
        })
    });
});

module.exports = router;