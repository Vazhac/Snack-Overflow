var express = require('express');
var router = express.Router();
let { User, Question, Answer, Comment, Upvote} = require("../db/models")

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
    let upvote = await Upvote.create({answerId,userId,isPositive})
    console.log(upvote)
    res.send()

}));

router.post("/:id(\\d+)/downvotes", asyncHandler(async (req, res) => {
    let answerId = req.params.id
    let userId = req.session.auth.userId
    let isPositive = false
    await Upvote.create({answerId,userId,isPositive})
    res.send()
}));

router.post("/:id(\\d+)/comments", replyValidators, asyncHandler(async (req, res) => {
    let {message} = req.body
    let answerId = req.params.id
    let userId = req.session.auth.userId
    let comment = await Comment.create({answerId,userId,message})
    let user = await User.findByPk(userId)
    comment.dataValues.author = user.username
    res.send(comment)
}));

module.exports = router;
