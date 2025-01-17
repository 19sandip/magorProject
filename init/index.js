const mongoose = require("mongoose");
const initdata = require("./data.js");
const List = require("../models/listing.js");
const getCoordinates = require("../utils/geoCode.js");


main().then((res) =>{
   saveAndCleanData();
    console.log("connected successfully");
})
.catch(err => console.log(err));


async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/airbnb');

}
// Convert Nominatim response to GeoJSON
const convertToGeoJSON = (nominatimData) => {
  return {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [
        parseFloat(nominatimData.lon),
        parseFloat(nominatimData.lat),
      ],
    },
  };
};

  const  saveAndCleanData = async () =>{
    await List.deleteMany({});
   
  initdata.data =  initdata.data.map((obj)=>{
      return {
        ...obj, 
         owner: "67867cbf92c92bbb55dadc3a",
      }
    });
    // console.log(listingWithOwner);
    await List.insertMany(initdata.data);
    console.log("data is saved man ")
 }