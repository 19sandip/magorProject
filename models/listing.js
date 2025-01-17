const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const { listingSchema } = require("../schema");


let listSchema = new Schema({
  title: {
    type: String
  },
  description: {
    type: String,
  },
  image: {
      url : String,
      fileName : String
  },
  price: {
    type: Number,
  },
  location: {
    type: String,
  },
  country: {
    type: String,
  },
  reviewList : [
    {
    type : Schema.Types.ObjectId,
    ref : "Review"
  }
],
owner: {
  type : Schema.Types.ObjectId,
  ref : "User"
},
 geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
    },
    coordinates: {
      type: [Number],
    }
  }
});


listSchema.post("findOneAndDelete", async (listing) => {
  if(listing){
    await Review.deleteMany({_id : {$in : listing.reviewList}});
  }
})



const Listing = mongoose.model("Listing", listSchema);

module.exports = Listing;
