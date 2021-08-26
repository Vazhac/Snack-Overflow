var express = require('express');
var router = express.Router();
let { User, Question, Answer, Comment, Upvote } = require("../db/models")

const { validationResult } = require("express-validator")
const { csrfProtection, asyncHandler } = require('./utils')
const { questionValidators, replyValidators } = require('../validators'); //Possibly add more comple validations for checking password complexity and confirm password complexictyu

/* GET questions listing. */

router.get("/:id(\\d+)", asyncHandler(async (req, res) => {
    let question = await Question.findByPk(req.params.id, { include: {all:true, nested:true}})
    let questionVoteCount = 0
    console.log("YEEE",question)
    for(let upvote of question.upvotes){
        if(upvote.isPositive)questionVoteCount++
        else questionVoteCount--
    }
    res.render('question-page', { question, session: req.session,questionVoteCount })
}));

router.put("/:id", questionValidators, asyncHandler(async (req, res) => {

    let question = await Question.findByPk(req.params.id);
    let { title, message } = req.body;

    const validatorErrors = validationResult(req);

    if (validatorErrors.isEmpty()) {
        question.title = title;
        question.message = message;
        question.save();
        res.send(question)
    } else {
        const errors = validatorErrors.array().map((err) => err.msg);
        res.send(errors)
    }
}));

router.delete("/:id", asyncHandler(async (req, res) => {
    let question = await Question.findByPk(req.params.id);
    await question.destroy();
    res.send();

}));

router.post("/:id(\\d+)/answers", replyValidators, asyncHandler(async (req, res) => {
    let {message} = req.body
    let questionId = req.params.id
    const validatorErrors = validationResult(req);
    if (validatorErrors.isEmpty()) {
        let answer = await Answer.create({ message, questionId, userId: req.session.auth.userId })
        res.send(answer)
    } else {
        const errors = validatorErrors.array().map((err) => err.msg);
        res.send(errors)
    }
}));

router.post("/:id(\\d+)/comments", replyValidators, asyncHandler(async (req, res) => {
    let {message} = req.body
    let questionId = req.params.id
    const validatorErrors = validationResult(req);
    if (validatorErrors.isEmpty()) {
        let comment = await Comment.create({ message, questionId, userId: req.session.auth.userId })
        res.send(comment)
    } else {
        const errors = validatorErrors.array().map((err) => err.msg);
        res.send(errors)
    }
}));

router.post("/:id(\\d+)/upvotes", asyncHandler(async (req, res) => {
    let questionId = req.params.id
    let userId = req.session.auth.userId
    let isPositive = true
    await Upvote.create({questionId,userId,isPositive})
    res.send()
}));

router.post("/:id(\\d+)/downvotes", asyncHandler(async (req, res) => {
    let questionId = req.params.id
    let userId = req.session.auth.userId
    let isPositive = false
    await Upvote.create({questionId,userId,isPositive})
    res.send()
}));

/* end section*/
router.get('/new', csrfProtection, asyncHandler(async (req, res, next) => {
    if (req.session.auth) {
        return res.render("new-question", {
            csrfToken: req.csrfToken(),
            errors: [],
            title: "Create a new Question"
        })
    } else {
        return res.redirect("/users/signup")
    }
}));

router.post('/new', csrfProtection, questionValidators, asyncHandler(async (req, res, next) => {
    const { title, message } = req.body;
    const validatorErrors = validationResult(req);

    const question = await Question.build({
        title,
        message,
        userId: req.session.auth.userId
    });

    if (validatorErrors.isEmpty()) {
        await question.save();
        res.redirect(`/questions/${question.id}`);
    } else {
        const errors = validatorErrors.array().map((err) => err.msg);
        res.render("new-question", {
            csrfToken: req.csrfToken(),
            title: "Create a new Question",
            errors,
        });
    }

}));

router.get('/', asyncHandler(async (req, res, next) => {
    const numberOfLinks = 5;
    const amountOfQuestions = await Question.count();
    const amountOfPages = Math.ceil(amountOfQuestions / numberOfLinks)
    let pageNumber = 1;
    if (req.query.page) {
        pageNumber = Number(req.query.page); //pageNumber will be a string if this statement is ran
    }
    const nextPage = pageNumber + 1;
    const prevPage = pageNumber - 1;
    const questions = await Question.findAll({
        include: [Answer, Comment],
        offset: (pageNumber - 1) * numberOfLinks,
        limit: numberOfLinks,
        orderBy: [["id", "DESC"]]
    });
    res.render('questions', {
        questions,
        session: req.session,
        amountOfPages,
        nextPage,
        prevPage,
        pageNumber
    })
}));


module.exports = router;
