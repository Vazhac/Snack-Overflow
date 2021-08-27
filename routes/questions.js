var express = require('express');
var router = express.Router();
let { User, Question, Answer, Comment, Upvote } = require("../db/models")

const { validationResult } = require("express-validator")
const { csrfProtection, asyncHandler } = require('./utils')
const { questionValidators, replyValidators } = require('../validators'); //Possibly add more comple validations for checking password complexity and confirm password complexictyu

/* GET questions listing. */

router.get("/:id(\\d+)", asyncHandler(async (req, res) => {
    let question = await Question.findByPk(req.params.id,{
        include: [Upvote, Comment, {
            model: Answer,
            include: [Upvote, Comment]
            }]
        })
    let user = await User.findByPk(question.userId)
    question.author = user.username
    let questionVoteCount = 0
    for(let upvote of question.Upvotes){
        if(upvote.isPositive)questionVoteCount++
        else questionVoteCount--
    }

    for(let answer of question.Answers){
        if(answer.Upvotes.length){
            answer.voteCount=answer.Upvotes.reduce((accum,vote)=>{
                if(vote.isPositive)return accum+1
                else return accum-1
            },0)
        } else answer.voteCount = 0
        let user = await User.findByPk(answer.userId)
        answer.author = user.username
        for(let comment of answer.Comments){
            let user = await User.findByPk(comment.userId)
            comment.author = user.username
        }
    }
    for(let comment of question.Comments){
        let user = await User.findByPk(comment.userId)
        comment.author = user.username
    }
    let votes;
    let votedAnswerIds;
    let votedAnswerIdsObject ={}
    let votedOnQuestion = false
    if (req.session.auth) {
        votes = await Upvote.findAll({where:{userId:req.session.auth.userId}})
        votedAnswerIds = votes.map(vote=>vote.answerId).filter(vote=>vote!==null)
        for(let answerId of votedAnswerIds){
            votedAnswerIdsObject[answerId]=true
        }
        if(votes.filter(vote=>vote.questionId===question.id).length>0) votedOnQuestion = true
    }
    console.log(question.Answers[0].Comments)
    res.render('question-page', {votedAnswerIdsObject,votedOnQuestion,votes, question,session: req.session,questionVoteCount })
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
        let user = await User.findByPk(req.session.auth.userId)
        answer.dataValues.author = user.username
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
        let user = await User.findByPk(req.session.auth.userId)
        comment.dataValues.author = user.username
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
        include: [Answer, Comment, Upvote],
        offset: (pageNumber - 1) * numberOfLinks,
        limit: numberOfLinks,
        orderBy: [["id", "DESC"]]
    });
    for(let question of questions){
        question.voteCount = question.Upvotes.reduce((accum,upvote)=>{
            if(upvote.isPositive)return 1
            else return -1
        },0)
    }
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
