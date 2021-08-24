var express = require('express');
var router = express.Router();
let bcrypt = require("bcryptjs")
let { User } = require("../db/models")
let {loginUser, logoutUser} = require("../auth.js")
const {validationResult } = require("express-validator")
const { csrfProtection, asyncHandler } = require('./utils')
const { signInValidators, signUpValidators } = require('../validators'); //Possibly add more comple validations for checking password complexity and confirm password complexictyu

/* GET users listing. */

router.get("/signup", csrfProtection, (req, res) => {
  if (req.session.auth) {
    return res.redirect('/');
  }
  res.render("sign-up", {
    csrfToken: req.csrfToken(),
    errors: []
  });
});

router.post("/signup", csrfProtection, signUpValidators, asyncHandler(async(req, res)=>{
  let {username, password, email} = req.body
  const validatorErrors = validationResult(req);

  const user = await User.build({
    username,
    email
  });

  if (validatorErrors.isEmpty()) {
    let hashedPassword = await bcrypt.hash(password, 10)
    user.hashedPassword = hashedPassword;
    user.save();
    loginUser(req, res, user);
    res.redirect("/")
  } else {
    const errors = validatorErrors.array().map((err) => err.msg);
    res.render('sign-up', {
      title: 'Sign-up',
      user,
      errors,
      csrfToken: req.csrfToken(),
    });
  }

}));

router.get("/signin", csrfProtection, asyncHandler(async(req, res, next) => {
  if (req.session.auth) {
    return res.redirect('/');
  }
  res.render("sign-in", {
    csrfToken: req.csrfToken(),
    errors: []
  });
}));

router.post("/signin", csrfProtection, signInValidators, asyncHandler(async(req, res, next) => {
  let {username, password} = req.body;
  const user = await User.findOne({
    where: {
      username
    }
  });
  const validatorErrors = validationResult(req);
  let passwordMatch;

  if (validatorErrors.isEmpty() && user) {
    console.log(user);
    passwordMatch = await bcrypt.compare(password, user.hashedPassword.toString());
    if (passwordMatch) {
      loginUser(req, res, user);
      return res.redirect('/');
    }
  } else {
    const errors = validatorErrors.array().map((err) => err.msg);
    if (!user || !passwordMatch) {
      errors.push('User name or password is incorrect');
    }
    res.render('sign-in', {
      title: 'Sign-in',
      user,
      errors,
      csrfToken: req.csrfToken(),
    });
  }
}));


module.exports = router;
