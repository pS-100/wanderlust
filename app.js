if(process.nextTick.NODE_ENV != "production") {
  require('dotenv').config()
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const method = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo").default ;
console.log(MongoStore);

const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const userRoute = require("./routes/user.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;
console.log(dbUrl);

main()
  .then(() => {
    console.log("connected successfully!!");
  })
  .catch((err) => console.log(err));
async function main() {
  // await mongoose.connect(MONGO_URL);
  await mongoose.connect(dbUrl);  
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(method("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});


store.on("erroe", () => {
  console.log("ERROR in  MONGO SESSION STORE", err);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,                //used to sign the session ID cookie, helps detect if someone has tampered with the cookie
  resave: false,                    //Express saves the session only when it changes.
  saveUninitialized: true,          //new session that has not been modified.
  cookie: {
    expires: Date.now() + 10 * 24 * 60 * 60 * 1000,
    maxAge: 10 * 24 * 60 * 60 * 1000,
    httpOnly: true
  },
};



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));           //static authenticate method of model in LocalStrategy

//static methods that support passport session
passport.serializeUser(User.serializeUser());                   //user related info save into session
passport.deserializeUser(User.deserializeUser());               //user related info remove into session

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);
app.use("/", userRoute);
 

app.use((req, res, next) => {
  next(new ExpressError("Page not found!!", 404));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "something went wrong!!" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

app.listen(8080, () => {
  console.log(`server listen to port to 8080`);
});