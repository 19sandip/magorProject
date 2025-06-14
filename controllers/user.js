const User = require("../models/user.js");


//not understand its work
const signupForm = (req, res) =>{
    res.render("./users/user.ejs");
   };



   const signupUser = async (req, res)=>{
    try{
        let {username, email, password} = req.body;
    let newUser = new User({email, username});
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err)=>{
        if(err) {
            return next(err);
        }
        req.flash("success", "Welcome to WanderLust!");
    res.redirect("/");
    })
    } catch(e){
        req.flash("error", `${e}`)
        res.redirect("/user/signup")
    } 
}




const loginForm = (req, res) =>{
    res.render("./users/login.ejs")
}

const loginUser = (req, res) =>{
    req.flash("success", "Welcome on WanderLust! You are Loggedin");
    let url = res.locals.redirectUrl|| "/";
    res.redirect(url);
    }


const logoutUser = (req, res, next) =>{
    req.logout((err)=>{
      if(err){
        return next(err);
      }
      req.flash("success", "you have logged Out !")
      res.redirect("/");
    })
  }
   module.exports = {
    signupForm,
    signupUser,
    loginForm,
    loginUser,
    logoutUser

   }