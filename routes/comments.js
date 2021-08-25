var express = require('express');
var router = express.Router();
let { User, Question, Answer, Comment } = require("../db/models")

const { validationResult } = require("express-validator")
const { csrfProtection, asyncHandler } = require('./utils')
const { questionValidators, replyValidators} = require('../validators');


router.delete("/:id", asyncHandler(async (req, res) => {
    let comment = await Comment.findByPk(req.params.id);
    await comment.destroy();
    res.send()
}));

router.put("/:id", replyValidators, asyncHandler(async (req,res)=>{
    let {message} = req.body
    let comment = await Comment.findByPk(req.params.id)
    comment.message = message
    const validatorErrors = validationResult(req);
    if (validatorErrors.isEmpty()) {
        comment.save()
        res.send(comment)
    }else {
        const errors = validatorErrors.array().map((err) => err.msg);
        res.send(errors)
    }
}))


module.exports = router;
