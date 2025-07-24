const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const mapController = require('../controllers/map.controller');
const { query } = require('express-validator');

router.get(
  '/get-coordinates',
  query('address')
    .isString()
    .isLength({ min: 3 })
    .withMessage('Address must be at least 3 characters long'),
  authMiddleware.authUser,            // ✅ middleware (should be a function)
  mapController.getCoordinates        // ✅ handler (should be a function)
);


 router.get('/get-distance-time',
     query('origin').isString().isLength({min: 3}), 
     query('destination').isString().isLength({min: 3}),
     authMiddleware.authUser, mapController.getDistanceTime,
    
 )

  router.get('/get-suggestions',
    query('input').isString().isLength({min:3}).withMessage('Input must be at least 3 characters long'),
    authMiddleware.authUser,mapController.getAutoCompleteSuggestions
  )




module.exports = router;
