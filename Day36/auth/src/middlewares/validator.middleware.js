const { body, validationResult } = require("express-validator");

const respondWithValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const registerUserValidations = [
  body("username")
    .isString()
    .withMessage("Username must be a string")
    .isLength({ min: 3 })
    .withMessage("Username must be atleast 3 character long"),
  body("email").isEmail().withMessage("invalid email address"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be atleast 6 characters long"),
  body("fullName.firstName")
    .isString()
    .withMessage("First name must be a string")
    .notEmpty()
    .withMessage("First name required "),
  body("fullName.lastName")
    .isString()
    .withMessage("First name must be a string")
    .notEmpty()
    .withMessage("First name required "),
  respondWithValidationErrors,
];

const loginUserValidations = [
  body("email").optional().isEmail().withMessage("Invalid Email"),

  body("username")
    .optional()
    .isString()
    .notEmpty()
    .withMessage("username required")
    .isLength({ min: 3 })
    .withMessage("Username must have atleast more than 3 characters"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must me atleast 6 characters long"),

  (req, res, next) => {
    if (!req.body.username && !req.body.email) {
      return res
        .status(400)
        .json({ message: "Either email or username is required" });
    }
    next();
  },
  respondWithValidationErrors,
];

const addUserAddressValidations = [
  body("street")
    .isString()
    .withMessage("Street must be a string")
    .notEmpty()
    .withMessage("Street is required"),

  body("city")
    .isString()
    .withMessage("City must be a string")
    .notEmpty()
    .withMessage("City is required"),

  body("state")
    .isString()
    .withMessage("state must be a string")
    .notEmpty()
    .withMessage("state is required"),
  body("pincode")
    .isString()
    .withMessage("pincode must be a string")
    .notEmpty()
    .withMessage("pincode is required")
    .bail()
    .matches(/^\d{4,}$/)
    .withMessage("Pincode must be at least 4 digits"),
  body("country")
    .isString()
    .withMessage("country must be a string")
    .notEmpty()
    .withMessage("country is required"),
  body("isDefault")
    .optional()
    .isBoolean()
    .withMessage("isDefault must be a boolean"),
  respondWithValidationErrors,
];

module.exports = {
  registerUserValidations,
  loginUserValidations,
  addUserAddressValidations,
};
