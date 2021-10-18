const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const keys = require("./keys");
const User = require("../models/user-model");

// send to browser and stored as cookie(user.id)
passport.serializeUser((user, done) => {
  done(null, user.id); // mongodb id
});
// send cookie to server then deseralize and find user finally load user data
passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

// telling passport to use google strategy
passport.use(
  new GoogleStrategy(
    {
      // options for the google strategy
      callbackURL: "/auth/google/redirect",
      clientID: keys.google.clientID,
      clientSecret: keys.google.clientSecret,
    },
    (accessToken, refreshToken, profile, done) => {
      // passport callback function
      // console.log(" passport callback function fired");
      console.log(profile);
      User.findOne({ googleid: profile.id }).then((currentUser) => {
        if (currentUser) {
          // already have the user
          console.log("user is:", currentUser);
          done(null, currentUser);
        } else {
          // if not, create user in our database
          new User({
            username: profile.displayName,
            googleid: profile.id,
            thumbnail: profile._json.picture,
          })
            .save()
            .then((newUser) => {
              console.log("new user created: " + newUser);
              done(null, newUser);
            });
        }
      });
    }
  )
);
