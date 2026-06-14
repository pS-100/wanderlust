const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/users.js");

router.get("/signup", userController.renderSignup);

router.post("/signup", wrapAsync(userController.signupUser));

//login get
router.get("/login", userController.renderLoginForm);

//login post
router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    //passport.authenticate() -> middleware that authenticate user
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userController.afterLogin
);

router.get("/logout", userController.logout);

module.exports = router;