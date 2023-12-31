const express = require('express');
const viewsController = require('../controllers/viewController');
const authController = require('../controllers/authController');

// Webpage routes ------------------------------
const router = express.Router();
router.get('/', authController.isLoggedIn, viewsController.getOverview);
router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/register', authController.isLoggedIn, viewsController.getRegisterForm);
router.get('/about', authController.isLoggedIn, viewsController.getAbout);
router.get('/me', authController.protect, viewsController.getAccount);
router.post('/submit-user-data', authController.protect, viewsController.updateUserData);

module.exports = router;
