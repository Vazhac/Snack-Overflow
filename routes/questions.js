var express = require('express');
var router = express.Router();
let { User, Question } = require("../db/models")

const {validationResult } = require("express-validator")
const { csrfProtection, asyncHandler } = require('./utils')
const { questionsValidators } = require('../validators'); //Possibly add more comple validations for checking password complexity and confirm password complexictyu

/* GET questions listing. */


/* end section*/



module.exports = router;
