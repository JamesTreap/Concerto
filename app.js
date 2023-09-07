const path = require('path'); // so we dont have to use DIRNAME
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
const cookieParser = require('cookie-parser');
const axios = require('axios');

const app = express();
app.set('view engine', 'pug'); // set pug as rendering engine

// sometimes have bug where directory is launched, using /, using path.join fixes this bug
app.set('views', path.join(__dirname, 'views'));

// 1) Middleware =================================================================
// Security HTTP headers
app.use(helmet());

// Development Logging
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

// API RATE LIMIT - 100 limits per hour
const limiter = rateLimit({
	max: 100,
	windowMs: 60 * 60 * 1000,
	message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution - e.g duplicate params
app.use(
	hpp({
		whitelist: ['duration', 'ratingsQuantity', 'price', 'ratingsAverage', 'maxGroupSize', 'difficulty'],
	})
);

// Serving static files
app.use(express.static(path.join(__dirname, 'public'))); // serve static page

// custom middleware - IMPORTANT: this needs to go above the API requests
app.use((req, res, next) => {
	req.requestTime = new Date().toISOString();
	if (process.env.NODE_ENV === 'production') {
		console.log(req.cookies);
		console.log(req.headers);
	}

	next();
});

// 3) API Routes ===================================================================
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
	next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

// 4) Start server =============================================================
module.exports = app;
