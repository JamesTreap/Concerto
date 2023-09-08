const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getOverview = catchAsync(async (req, res, next) => {
	// 1) Get tour data from collection
	const tours = await Tour.find().sort({ startDates: 1 });
	const toptours = await Tour.find().sort({ ratingsAverage: 1 }).limit(3);

	// 2) Render thatn template using tour data and base template
	res.status(200).render('overview', {
		title: 'Home',
		tour: 'The Forest Hiker',
		tours: tours,
		toptours: toptours,
	});
});

exports.getTour = catchAsync(async (req, res, next) => {
	// 1) Get the data for the requested tour
	const tour = await Tour.findOne({ slug: req.params.slug }).populate({
		path: 'reviews',
		fields: 'review rating user',
	});

	if (!tour) {
		return next(new AppError('There is no tour with that name!', 404));
	}

	// 2) Render the page
	res.status(200).render('tour', {
		title: `${tour.name} Tour`,
		tour: tour,
	});
});

exports.getLoginForm = (req, res) => {
	res.status(200).render('login', {
		title: 'Log into your account',
	});
};

exports.getRegisterForm = (req, res) => {
	res.status(200).render('register', {
		title: 'Sign up',
	});
};

exports.getAccount = (req, res) => {
	res.status(200).render('account', {
		title: 'Your account',
	});
};

exports.getAbout = (req, res) => {
	res.status(200).render('about', {
		title: 'About Concerto',
	});
};


exports.updateUserData = catchAsync(async (req, res, next) => {
	const updatedUser = await User.findByIdAndUpdate(
		req.user.id,
		{
			name: req.body.name,
			email: req.body.email,
		},
		{
			new: true,
			runValidators: true,
		}
	);

	res.status(200).render('account', {
		title: 'Your account',
		user: updatedUser,
	});
});
