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
      url : {
        type:String,
        default:"https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1750&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      },
      fileName : String,
      
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
  },
  category:{
    type: String,
    default: "Apartment"
  }
});


listSchema.post("findOneAndDelete", async (listing) => {
  if(listing){
    await Review.deleteMany({_id : {$in : listing.reviewList}});
  }
})



const Listing = mongoose.model("Listing", listSchema);

module.exports = Listing;
