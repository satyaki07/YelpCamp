var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');

// Show all campgrounds
router.get("/", (req, res) => {
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds) {
           if (err) {
                  console.log(err);
           } else {
                  res.render("campgrounds/index", {campgrounds: allCampgrounds});
           }
    });
});

// Create new campground
router.post("/", isLoggedIn, (req, res) => {
    // Get data back from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name, image, description: desc, author};
    // Create a new campground and save that to DB
    Campground.create(newCampground, function(err, newlyCreated) {
           if (err) {
                  console.log(err);
           } else {
                  // redirect back to campgrounds page
                  console.log(newlyCreated);
                  res.redirect("/campgrounds");
           }
    });
});

// Show form to create new campground
router.get("/new", isLoggedIn, (req, res) => {
    res.render("campgrounds/new")
});

router.get("/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
           //  console.log(foundCampground)
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//Edit campground route
router.get("/:id/edit", (req, res) => {
    Campground.findById(req.params.id, function(err, foundCampground) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.render("campgrounds/edit", {campground: foundCampground});
        }
    });
});

//Update Campground Route
router.put("/:id", (req, res) => {
    // find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            //redirect to show page
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// Destroy Campground Route
router.delete("/:id", (req, res) => {
    Campground.findByIdAndDelete(req.params.id, function(err) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});
// Middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
           return next();
    }
    res.redirect("/login");
}

module.exports = router;