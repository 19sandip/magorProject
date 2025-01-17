const express = require("express");
const app = express();
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");
const engine = require("ejs-mate");

app.engine("ejs", engine);
app.use(express.static(path.join(__dirname, "/public")));
app.use(flash());

let  sessionOptions = {
    
        secret : "superscurestring",
        resave : false,
        saveUninitialized : true,
    
}

app.use(session(sessionOptions));
app.use((req, res, next) =>{
     res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    next();
})

app.get("/register", (req, res)=>{
    let {name= "anonymous"} = req.query;
    req.session.name = name;
    if(name == "anonymous") {
    req.flash("error", "user not registerd");
    } else{
        req.flash("success", "registerd successfully");
    }
    
    res.redirect("/greet");
});

app.get("/greet", (req, res)=>{
   
    res.render("./flash.ejs", {name :req.session.name});
})
app.listen(3030, ()=>{
    console.log("app is listening on the port 3000");
})