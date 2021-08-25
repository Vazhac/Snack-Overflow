const { check } = require('express-validator');
const db = require('./db/models');

const signUpValidators = [
  check('username')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for Username')
    .isLength({ max: 50 })
    .withMessage('Username must not be more than 50 characters long')
    .custom((value) => {
      return db.User.findOne({ where: { username: value } })
        .then((user) => {
          if (user) {
            return Promise.reject('The provided username is already in use by another account');
          }
        });
    }),
  check('email')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for Email Address')
    .isLength({ max: 255 })
    .withMessage('Email Address must not be more than 255 characters long')
    .isEmail()
    .withMessage('Email Address is not a valid email')
    .custom((value) => {
      return db.User.findOne({ where: { email: value } })
        .then((user) => {
          if (user) {
            return Promise.reject('The provided Email Address is already in use by another account');
          }
        });
    }),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for Password')
    .isLength({ max: 255 })
    .withMessage('Password must not be more than 255 characters long'),
  check('confirmPassword')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for Confirm Password')
    .isLength({ max: 255 })
    .withMessage('Confirm Password must not be more than 255 characters long')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Confirm Password does not match Password');
      }
      return true;
    })
];

const signInValidators = [
  check('username')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for Username'),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for Password')
  // .custom(() => {
  //   console.log('sign in checker')
  // })
]

const questionValidators = [
  check('title')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for Title')
    .isLength({ max: 255 })
    .withMessage('Title must not be more than 255 characters long'),
  check('message')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for Message')
    .isLength({ max: 30000 }) //Following StackOverflow's recommendation of 30000 characters
    .withMessage('Message must not be more than 30000 characters long')
]

const replyValidators = [
  check('message')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for Message')
    .isLength({ max: 30000 }) //Following StackOverflow's recommendation of 30000 characters
    .withMessage('Message must not be more than 30000 characters long')
]

module.exports = {
  signUpValidators,
  signInValidators,
  questionValidators,
  replyValidators
}
