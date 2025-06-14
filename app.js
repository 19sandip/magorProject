
const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const engine = require("ejs-mate");
const path = require("path");
const ExpressError = require("./utils/ExpressError.js");
const methodOverride = require("method-override");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session"); 
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const app = express();

dotenv.config();

app.use(express.urlencoded({ extended: true }));

app.engine("ejs", engine);
app.use(express.static(path.join(__dirname, "/public")));


const atlusUrl = process.env.ATLUS_URL;
const store = MongoStore.create({
  mongoUrl : atlusUrl,
  crypto:{
    secret : process.env.SECRET || "someSecretKey"
  },
  touchAfter: 24*3600
})

const sessionOption = {
  store,
  secret : process.env.SECRET || "someSecretKey",
  resave : false,
  saveUninitialized : true,
  cookie:{
  expires : Date.now() * 7 *24 * 60 *60* 1000,
  maxAge : 7 *24 * 60 *60* 1000,
  httpOnly : true,
  }
}

store.on("error", () =>{
  console.log("error in mongo sessions")
})
app.use(session(sessionOption));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());





// override with POST having ?_method=DELETE
app.use(methodOverride("_method"));

main()
  .then((res) => {

    console.log("connected successfully");
  })
  .catch((err) => console.log(err));

async function main() {
return await mongoose.connect(atlusUrl);
}


app.use((req, res, next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser= req.user; 
  next();
})


app.use("/", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
// app.use("/listings", listingRouter);
app.use("/user", userRouter);


app.all("*", (req, res, next) => {
  next(new ExpressError(404, "page not found"));
});


// error handler global middleware
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "something went wrong!" } = err;
  res.render("listings/error.ejs", { message });
  
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
