const Listing = require("../models/listing.js");
const List = require("../models/listing.js");
const getCoordinates = require("../utils/geoCode.js");
const index = async (req, res) => {
  let allListings = await List.find();
  res.render("listings/index.ejs", { allListings });
};

const deleteListing = async (req, res) => {
  let { id } = req.params;
  await List.findByIdAndDelete(id);
  req.flash("success", "listing deleted");
  res.redirect("/listings");
};

const editListing = async (req, res) => {
  let { id } = req.params;

  let list = await List.findById(id);
  if (!list) {
    req.flash("error", "this list is not exist");
    res.redirect(`/listings`);
  }
  let originalImageUrl = list.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_150,w_300");
  res.render("listings/edit.ejs", { list, originalImageUrl });
};

const updateListing = async (req, res) => {
  let { id } = req.params;
  let updatedListing = await List.findByIdAndUpdate(id, {
    ...req.body.listing,
  });
  if (typeof req.file !== "undefined") {
    const url = req.file.path;
    const fileName = req.file.filename;
    updatedListing.image = { url, fileName };
  }
  await updatedListing.save();
  req.flash("success", "listing updated");
  res.redirect(`/listings/${id}`);
};

const addnewListingForm = (req, res) => {
  res.render("listings/new.ejs");
};


const newListing = async (req, res) => {
  const url = req.file.path;
  const fileName = req.file.filename;

  const newListing = new List(req.body.listing);
  const coordinates = await getCoordinates(newListing.location);
    const geoJson = convertToGeoJSON(coordinates);
  newListing.geometry = geoJson.geometry;
  newListing.owner = req.user._id;
  newListing.image = { url, fileName };
  await newListing.save();
  req.flash("success", "new List added");
  res.redirect("/listings");
};

// Convert Nominatim response to GeoJSON
const convertToGeoJSON = (nominatimData) => {
  return {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [
        parseFloat(nominatimData.lat),
         parseFloat(nominatimData.lon),
      ],
    },
  };
};


const showOneListing = async (req, res) => {
  let { id } = req.params;
  let oneList = await List.findById(id)
    .populate({ path: "reviewList", populate: { path: "author" } })
    .populate("owner");
  let lan = oneList.geometry.coordinates[0];
  let lon = oneList.geometry.coordinates[1];

  if (!oneList) {
    req.flash("error", "listing you created for does not exist");
    res.redirect("/listings");
  }
  res.render("listings/showOneList.ejs", { oneList});
};

module.exports = {
  index,
  deleteListing,
  editListing,
  updateListing,
  addnewListingForm,
  newListing,
  showOneListing,
  convertToGeoJSON
};
