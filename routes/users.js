var express = require('express');
var router = express.Router();
let bcrypt = require("bcryptjs")
let {User} = require("../db/models")
let loginUser = require("../auth.js")
const {check,validationResult} = require("express-validator")

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get("/signup",async(req,res,next)=>{
  res.render("sign-up")
})

router.post("/signup",async(req,res,next)=>{
  let {username,password,email,confirmPassword} = req.body
  if(password!==confirmPassword){
    return res.render("sign-up")
  }
  let hashedPassword = await bcrypt.hash(password,10)
  let user = await User.create({username,hashedPassword,email})
  loginUser(req,res,user)
  res.redirect("/")
})


module.exports = router;
