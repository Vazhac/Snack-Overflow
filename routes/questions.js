var express = require('express');
var router = express.Router();
let { User, Question } = require("../db/models")

const { validationResult } = require("express-validator")
const { csrfProtection, asyncHandler } = require('./utils')
const { questionsValidators } = require('../validators'); //Possibly add more comple validations for checking password complexity and confirm password complexictyu
const question = require('../db/models/question');

/* GET questions listing. */

router.get("/questions/:id", asyncHandler(async( req, res) => {
 let question = await Question.findByPk(req.params.id, { include: Answer })

 res.render('question-page', { question } )
}));

router.put("/questions/:id", asyncHandler(async (req, res) => {
    let question = await Question.findByPk(req.params.id);
    let { title, message } = req.body;
    question.title = title;
    question.message = message;
    question.save();
    res.render('question-page', { question } )

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
            title: "Create a new Question"
        })
    } else {
        return res.redirect("/users/signup")
    }
}));


module.exports = router;
