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

router.put("/:id", replyValidators, asyncHandler(async (req,res)=>{
    let {message} = req.body
    let answer = await Answer.findByPk(req.params.id)
    answer.message = message
    const validatorErrors = validationResult(req);
    if (validatorErrors.isEmpty()) {
        answer.save()
        res.send(answer)
    }else {
        const errors = validatorErrors.array().map((err) => err.msg);
        res.send(errors)
    }
}))


router.post("/:id(\\d+)/upvotes", asyncHandler(async (req, res) => {
    let answerId = req.params.id
    let userId = req.session.auth.userId
    let isPositive = true
    Upvote.create({answerId,userId,isPositive})

}));

router.post("/:id(\\d+)/downvotes", asyncHandler(async (req, res) => {
    let answerId = req.params.id
    let userId = req.session.auth.userId
    let isPositive = false
    Upvote.create({answerId,userId,isPositive})
}));

module.exports = router;
