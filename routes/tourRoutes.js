const express = require('express');
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');
const reviewRouter = require('./../routes/reviewRoutes');
const router = express.Router();

// router.param('id', tourController.checkID);
router.use('/:tourId/reviews', reviewRouter); // see reviewRoutes.js
router.route('/top-3').get(tourController.aliasTopTours, tourController.getAllTours);
router.route('/tour-stats').get(tourController.getTourStats);

router
	.route('/monthly-plan/:year')
	.get(
		authController.protect,
		authController.restrictTo('admin', 'lead-singer', 'singer'),
		tourController.getMonthlyPlan
	);

router
	.route('/tours-within/:distance/center/:latlng/unit/:unit')
	.get(tourController.getToursWithin);

router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);

router
	.route('/')
	.get(tourController.getAllTours)
	.post(
		authController.protect,
		authController.restrictTo('admin', 'lead-singer'),
		tourController.createTour
	);

router
	.route('/:id')
	.get(tourController.getTour)
	.patch(
		authController.protect,
		authController.restrictTo('admin', 'lead-singer'),
		tourController.updateTour
	)
	.delete(
		authController.protect,
		authController.restrictTo('admin', 'lead-singer'),
		tourController.deleteTour
	);

module.exports = router;
