const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

let userSchema = new Schema ({
    email:{
        type : String,
        required: true
    },
    username:{
        type : String,
        required: true
    }
})


userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);