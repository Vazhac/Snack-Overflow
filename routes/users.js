var express = require('express');
var router = express.Router();
let bcrypt = require("bcryptjs")
let {User} = require("../db/models")
let loginUser = require("../auth.js")
const {check, validationResult} = require("express-validator")
const { csrfProtection, asyncHandler } = require('./utils')

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});

router.get("/signup", csrfProtection, (req, res)=>{
  res.render("sign-up", {
    csrfToken: req.csrfToken(),
  });
});

router.post("/signup", csrfProtection, asyncHandler(async(req,res,next)=>{
  let {username,password,email,confirmPassword} = req.body
  if(password!==confirmPassword){
    return res.render("sign-up", {
      csrfToken: req.csrfToken(),
    });
  }
  let hashedPassword = await bcrypt.hash(password,10)
  let user = await User.create({username,hashedPassword,email})
  loginUser(req,res,user)
  res.redirect("/")
}));


module.exports = router;
