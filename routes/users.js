var express = require('express');
var router = express.Router();
let bcrypt = require("bcryptjs")
let {User} = require("../db/models")

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get("/signup",async(req,res,next)=>{
  res.render("sign-up")
})

router.post("/signup",async(req,res,next)=>{
  let {username,password,email} = req.body
  let hashedPassword = bcrypt.hash(password,10)
  let user = await User.create({username,hashedPassword,email})
  res.redirect("/")
})


module.exports = router;
