const express = require("express");
const router = express.Router();

const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");

router.route("/signup")
.get(userController.signupForm)
.post(userController.signupUser);

router.route("/login")
.get( userController.loginForm)
.post(
     saveRedirectUrl,
     passport.authenticate("local", {failureRedirect : "/user/login", failureFlash : true}) , userController.loginUser);

//logout route
router.get("/logout", userController.logoutUser)


module.exports = router;