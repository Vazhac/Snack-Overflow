var express = require('express');
var router = express.Router();
let bcrypt = require("bcryptjs")
let { User } = require("../db/models")
let {loginUser, logoutUser} = require("../auth.js")
const {validationResult } = require("express-validator")
const { csrfProtection, asyncHandler } = require('./utils')
const { signInValidators, signUpValidators } = require('../validators'); //Possibly add more comple validations for checking password complexity and confirm password complexictyu

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});

router.get("/signup", csrfProtection, (req, res)=>{
  const errors = [];
  res.render("sign-up", {
    csrfToken: req.csrfToken(),
    errors,
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
  res.render("sign-in", {
    csrfToken: req.csrfToken(),
  });
}));

router.post("/signin", csrfProtection, asyncHandler(async(req, res, next) => {
  let {username, password} = req.body;
  const user = User.findOne({
    where: {
      username
    }
  });

  const hashedPassword = await bcrypt.hash(password, 10);

  if (!user || hashedPassword !== user.hashedPassword) {
    //TODO : Update error handling for this if condition
    return res.render("sign-in", {
      csrfToken: req.csrfToken(),
    });
  }

  loginUser(req, res, user)
  res.redirect("/")
}));


module.exports = router;
