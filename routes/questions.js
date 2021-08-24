var express = require('express');
var router = express.Router();
let { User, Question } = require("../db/models")

const { validationResult } = require("express-validator")
const { csrfProtection, asyncHandler } = require('./utils')
const { questionValidators } = require('../validators'); //Possibly add more comple validations for checking password complexity and confirm password complexictyu
const question = require('../db/models/question');

/* GET questions listing. */

router.get("/questions/:id", asyncHandler(async (req, res) => {
    let question = await Question.findByPk(req.params.id, { include: Answer })

    res.render('question-page', { question })
}));

router.put("/questions/:id", asyncHandler(async (req, res) => {
    let question = await Question.findByPk(req.params.id);
    let { title, message } = req.body;
    question.title = title;
    question.message = message;
    question.save();
    res.render('question-page', { question })

}));

router.delete("/questions/:id", asyncHandler(async (req, res) => {
    let question = await Question.findByPk(req.params.id);
    await question.destroy();
    res.redirect('/');

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
        userId: req.session.auth.id
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


module.exports = router;
