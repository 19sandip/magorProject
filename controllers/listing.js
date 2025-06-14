const Listing = require("../models/listing.js");
const getCoordinates = require("../utils/geoCode.js");


const showAllListing = async (req, res) => {
  let allListings = await Listing.find();
  
  res.render("listings/index.ejs", { allListings });
};

const deleteListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "listing deleted");
  res.redirect("/");
};

const editListing = async (req, res) => {
  let { id } = req.params;
  let list = await Listing.findById(id);
  if (!list) {
    req.flash("error", "this list is not exist");
    res.redirect(`/`);
  }
  let originalImageUrl = list.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_150,w_300");
  res.render("listings/edit.ejs", { list, originalImageUrl });
};

const updateListing = async (req, res) => {
  let { id } = req.params;
  let updatedListing = await Listing.findByIdAndUpdate(id, {
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
  if(!req.file){
    req.flash("error", "Please upload an image for your listing");
      return res.redirect("/listings/addNew");
  }

  const  url = req.file.path;
  const fileName = req.file.filename;
  
  const newListing = new Listing(req.body.listing);
  const coordinates = await getCoordinates(newListing.location);
    const geoJson = convertToGeoJSON(coordinates);
  newListing.geometry = geoJson.geometry;
  newListing.owner = req.user._id;
  newListing.image = { url, fileName };
  await newListing.save();
  req.flash("success", "new List added");
  res.redirect("/");
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

const searchListings = async (req, res) =>{
  console.log("searching listings");
    let listings = await Listing.find();

const searchQuery = req.query.search|| "";
console.log("searchQuery", searchQuery);

  const filteredListings = listings.filter(listing =>
    listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    listing.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  res.render('listings/index.ejs', { allListings: filteredListings });
 }


const showOneListing = async (req, res) => {
  let { id } = req.params;
  let oneList = await Listing.findById(id)
    .populate({ path: "reviewList", populate: { path: "author" } })
    .populate("owner");


  if (!oneList) {
    req.flash("error", "listing you created for does not exist");
    res.redirect("/");
  }
  res.render("listings/showOneList.ejs", { oneList});
};

module.exports = {
  showAllListing,
  deleteListing,
  editListing,
  updateListing,
  addnewListingForm,
  newListing,
  showOneListing,
  convertToGeoJSON,
  searchListings
};
