const { mapsLimit } = require('../middlewares/rate-limit');
const express = require('express');
const router = express.Router();
const authMiddleware = require('../models/middlewares/auth.middleware');
const mapController = require('../controllers/map.controller');
const { query } = require('express-validator');
router.use(authMiddleware.authUser, mapsLimit);

router.get(
  '/get-coordinates',
  query('address')
    .isString()
    .isLength({ min: 3, max: 300 })
    .withMessage('Address must be at least 3 characters long'),
              // ✅ middleware (should be a function)
  mapController.getCoordinates        // ✅ handler (should be a function)
);


 router.get('/get-distance-time',
     query('origin').isString().isLength({min: 3, max: 300}),
     query('destination').isString().isLength({min: 3, max: 300}),
      mapController.getDistanceTime,

 )

  router.get('/get-suggestions',
    query('input').isString().isLength({ min: 1, max: 300 }),
    mapController.getAutoCompleteSuggestions
  )




module.exports = router;
