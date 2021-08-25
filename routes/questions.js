var express = require('express');
var router = express.Router();
let { User, Question, Answer, Comment } = require("../db/models")

const { validationResult } = require("express-validator")
const { csrfProtection, asyncHandler } = require('./utils')
const { questionValidators, replyValidators } = require('../validators'); //Possibly add more comple validations for checking password complexity and confirm password complexictyu

/* GET questions listing. */

router.get("/:id(\\d+)", asyncHandler(async (req, res) => {
    //  let question = await Question.findByPk(req.params.id)
    let question = await Question.findByPk(req.params.id, { include: [Answer, Comment] })
    console.log(question)
    res.render('question-page', { question, session: req.session })
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
    let { message, questionId } = req.body
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
    console.log("hitting route?????")
    let { message, questionId } = req.body
    const validatorErrors = validationResult(req);
    if (validatorErrors.isEmpty()) {
        let comment = await Comment.create({ message, questionId, userId: req.session.auth.userId })
        res.send(comment)
    } else {
        const errors = validatorErrors.array().map((err) => err.msg);
        res.send(errors)
    }
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
    let questions = await Question.findAll({ include: [Answer, Comment] })
    res.render('questions', { questions, session: req.session })
}));


module.exports = router;
