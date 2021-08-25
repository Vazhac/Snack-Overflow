var express = require('express');
var router = express.Router();
let { User, Question, Answer, Comment } = require("../db/models")

const { validationResult } = require("express-validator")
const { csrfProtection, asyncHandler } = require('./utils')
const { questionValidators, replyValidators} = require('../validators'); 

router.delete("/:id", asyncHandler(async (req, res) => {
    let answer = await Answer.findByPk(req.params.id);
    await answer.destroy();
    res.send()
}));


module.exports = router;