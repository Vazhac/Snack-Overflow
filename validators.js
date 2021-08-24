const signUpValidators = [
  check('username')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for Username')
    .isLength({ max: 50 })
    .withMessage('Username must not be more than 50 characters long'),
  check('email')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for Email Address')
    .isLength({ max: 255 })
    .withMessage('Email Address must not be more than 255 characters long')
    .isEmail()
    .withMessage('Email Address is not a valid email'),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for Password')
    .isLength({ max: 255 })
    .withMessage('Password must not be more than 255 characters long'),
  check('confirmPassword')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for Confirm Password')
    .isLength({ max: 255 })
    .withMessage('Confirm Password must not be more than 255 characters long'),
];

const signInValidators = [
  check('username')
  .exists({ checkFalsy: true })
  .withMessage('Please provide a value for Username'),
  check('password')
  .exists({ checkFalsy: true })
  .withMessage('Please provide a value for Password'),
]

module.exports = {
  signUpValidators,
  signInValidators
}
