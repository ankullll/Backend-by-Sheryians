const {body,validationResult} = require('express-validator')

function validate(req,res,next){
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    next()
}

const validationRules = [
    body("username")
    .optional()
    .isString().withMessage("username must be a string")
    .isLength({min:3}).withMessage("username must have more than 3 characters"),
    body("email")
    .isEmail().withMessage("Invalid email"),
    body("password")
    .isLength().withMessage("must be 6 character long")
    .isStrongPassword().withMessage("Weak password"),   
    validate
]

module.exports = validationRules;