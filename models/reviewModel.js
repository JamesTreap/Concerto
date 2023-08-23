// review / rating / createdAt / reference to tour / ref to user
const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
	{
		review: {
			type: String,
			required: [true, 'Review cannot be empty!']
		},
		rating: {
			type: Number,
			min: 1,
			max: 5
		},
		createdAt: {
			type: Date,
			default: Date.now
		},
		tour: {
			type: mongoose.Schema.ObjectId,
			ref: 'Tour',
			require: [true, 'Review must belong to a tour.']
		},
		user: {
			type: mongoose.Schema.ObjectId,
			ref: 'User',
			required: [true, 'Review must belong to a user']
		}
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true }
	}
);

// make it so a user can only leave one review per tour
// i.e they can't spam reviews lol
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
	this.populate({
		path: 'user',
		select: 'name photo'
	});
	next();
});

reviewSchema.statics.calcAverageRatings = async function (tourId) {
	const stats = await this.aggregate([
		{
			$match: { tour: tourId }
		},
		{
			$group: {
				_id: '$tour',
				nRating: { $sum: 1 },
				avgRating: { $avg: '$rating' }
			}
		}
	]);
	// console.log(stats);

	if (stats.length > 0) {
		// if there is more than one review
		await Tour.findByIdAndUpdate(tourId, {
			ratingsQuantity: stats[0].nRating,
			ratingsAverage: stats[0].avgRating
		});
	} else {
		// otherwise there are no reviews
		await Tour.findByIdAndUpdate(tourId, {
			ratingsQuantity: 0,
			ratingsAverage: 0
		});
	}
};

// must be post, not pre here, otherwise won't query the current tour
reviewSchema.post('save', function () {
	// this points to current review
	this.constructor.calcAverageRatings(this.tour);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
	this.r = await this.findOne();
	// console.log(this.r);
	next();
});

// pass data from the functiom above
reviewSchema.post(/^findOneAnd/, async function () {
	// await this.findOne(); does NOT work here, query has already executed
	await this.r.constructor.calcAverageRatings(this.r.tour);
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;

// POST /tour/someidhere/reviews - this is called a nested route
// similarly, GET /tour/touridhere/reviews
