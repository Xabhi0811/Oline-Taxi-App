const express = require('express')
const router = express.Router();
const {body} = require("express-validator")
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');



router.post('/register',[
    body('email').isEmail().withMessage('invalid email'),
    body('fullname.firstname').isLength({ min: 3}).withMessage('first give your name proparly'),
    body('Password').isLength({min:  6 }).withMessage('password must be 6 digit')
],
   userController.registerUser

)

router.post('/login',[body('email').isEmail().withMessage('invalid email'),
    body('Password').isLength({min:  6 }).withMessage('password must be 6 digit')],

   userController.loginUser

)

router.get('/profile',authMiddleware.authUser,userController.getUserProfile)


router.get('/logout', authMiddleware.authUser, userController.logoutUser)




module.exports = router;
