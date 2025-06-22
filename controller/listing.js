const Listing = require('../models/listing');
const axios = require("axios");

module.exports.index = async(req,res) => {
        const allisting = await Listing.find();
        res.render('listings/index.ejs',{allisting});
}
module.exports.shownewForm = (req,res) => {
    res.render('listings/new.ejs');
}
module.exports.showListing = async(req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!listing){
        throw new ExceptionErr(404,'Bad request');
    }
    res.render('listings/show.ejs',{listing});
}
module.exports.createNewListing = async(req,res,next) => {
     let {filename,path:url} = req.file;
     const newListing = req.body.listing;
     let location = newListing.location;
     const geoRes = await axios.get("https://nominatim.openstreetmap.org/search", {
        params: {
             q: location,
             format: "json"
                },
             headers: {
                "User-Agent": "your-app-name"
                }
        });
    if (geoRes.data.length === 0) {
    return res.send("Location not found");
    }

    const coordinates = [
    parseFloat(geoRes.data[0].lon),
    parseFloat(geoRes.data[0].lat)
    ];    
    newListing.Geolocation = {coordinates};
    newListing.owner = req.user._id;
    newListing.image = {filename,url};
    const listing = new Listing(newListing);
    await listing.save()
    req.flash("success","Listing added successfully!");
    res.redirect('/listings');
}
module.exports.getEditForm = async(req,res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
      req.flash("error","Listing you are looking for does not exists!");
      res.redirect('/listing');
    }
    res.render('listings/edit.ejs',{listing});
}
module.exports.updateListing = async(req,res) => {
     let {id} = req.params;
      if(!req.body.listing){
        throw new ExceptionErr(400,"Send Valid data for listing");
      }
     let newListing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
     if(req.file){
        let {filename,path:url} = req.file;
        newListing.image={filename,url};
        await newListing.save();
     }
     req.flash("success","Listing Updated successfully!");
     res.redirect(`/listings/${id}`);
}
module.exports.destroyListing = async(req,res) => {
     let {id} = req.params;
     await Listing.findByIdAndDelete(id);
     req.flash("success","Listing deleted successfully!");
     res.redirect('/listings');
}