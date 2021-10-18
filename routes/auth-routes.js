// invoking router method to create an instance of router
const router = require("express").Router();
const passport = require("passport");
// auth login
router.get("/login", (req, res) => {
  res.render("login", { user: req.user });
});

// auth logout
router.get("/logout", (req, res) => {
  //handle with passport
  // res.send("logging out");
  req.logout();
  res.redirect("/");
});

// auth with google   -> /auth/google handler
/*router.get("/google", (req, res) => {
  // handle with passport to go to consent screen
  res.send("logging in with google");
});*/

// starting to use passport after clicking google+
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile"],
  })
);

// callback route for google to redirect to
// fires callback function
router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  // res.send("you reached the callback URI");
  // res.send(req.user);
  res.redirect("/profile/");
});
module.exports = router;
