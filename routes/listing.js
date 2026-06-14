const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const listingController = require("../controllers/listings.js");

const multer  = require('multer')
const { storage } = require("../cloudinaryConfig.js")
const upload = multer({ storage })                 //initialize n save file in folder n folder created autom

router
  .route("/")
  .get(wrapAsync(listingController.index))                    //index route
  .post(                                                      //create route
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing),
  );

//new route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(listingController.showListings))           //show route
  .put(                                                     //update route
  isLoggedIn,
  isOwner,
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(listingController.updateListing))
  .delete(                                                  //delete route
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.deleteListing),
);

//edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm),
);

module.exports = router;

// let { id } = req.params;
// let listing = await Listing.findById(id);
// if(!listing.owner._id.equals(res.locals.currUser._id)) {
//   req.flash("error", "you don't have permission to edit");
//   return res.redirect(`/listings/${id}`);
// }
