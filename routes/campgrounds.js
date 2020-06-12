var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');

router.get("/campgrounds", (req, res) => {
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds) {
           if (err) {
                  console.log(err);
           } else {
                  res.render("campgrounds/index", {campgrounds: allCampgrounds});
           }
    });
   // res.render("campgrounds", { campgrounds });
});

router.post("/campgrounds", (req, res) => {
    // Get data back from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {name, image, description: desc};
    // Create a new campground and save that to DB
    Campground.create(newCampground, function(err, newlyCreated) {
           if (err) {
                  console.log(err);
           } else {
                  // redirect back to campgrounds page
                  res.redirect("/campgrounds");
           }
    });
});

router.get("/campgrounds/new", (req, res) => {
    res.render("campgrounds/new")
});

router.get("/campgrounds/:id", function(req, res){
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
})

module.exports = router;