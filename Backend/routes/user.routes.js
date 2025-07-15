const express = require('express')
const router = express.Router();
const {body} = require("express-validator")
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');



router.post('/register', [
    body('fullName.firstName')
        .isLength({ min: 3 })
        .withMessage('First name must be at least 3 characters'),
    body('email')
        .isEmail()
        .withMessage('Invalid email'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),
], userController.registerUser);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('invalid email'),
    body('password').isLength({ min: 6 }).withMessage('password must be 6 digit')
  ],
  userController.loginUser
);

console.log("✅ authMiddleware.authUser type:", typeof authMiddleware.authUser); 
console.log("✅ userController.getUserProfile type:", typeof userController.getUserProfile);

router.get('/profile', authMiddleware.authUser, userController.getUserProfile);


router.post('/logout', authMiddleware.authUser,userController.logoutUser);






module.exports = router;
