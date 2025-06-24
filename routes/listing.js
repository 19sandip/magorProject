const express = require("express");
const  router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isloggedin, isOwner,validateListings} = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer');
const  {storage} = require("../cloudConfig.js");
const upload = multer({storage})



// index route and adding new listing route

router
.route("/")
.get(wrapAsync(listingController.showAllListing))



//add new listing route
router.route("/listings/addnew")
.get(isloggedin, listingController.addnewListingForm)
.post(
  upload.single("listing[image]"),
  validateListings,
  wrapAsync(listingController.newListing)
);

router.route("/search").get(
  wrapAsync(listingController.searchListings)
);


router.route("/listings/:id")
.delete(isloggedin,isOwner,wrapAsync(listingController.deleteListing)
).get(
  wrapAsync(listingController.showOneListing)
).put(
  isloggedin,
  isOwner,
  upload.single("listing[image]"),
  validateListings,
  wrapAsync(listingController.updateListing)
);
// edit route
router.get(
  "/listings/:id/edit",
  isloggedin,
  isOwner,
  wrapAsync(listingController.editListing)
);

module.exports = router;
