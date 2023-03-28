import Campground from "../models/campground.js";
import Review from "../models/reviews.js";


const submitNewReview = async (req, res) => {
    const review = new Review(req.body.review);
    review.author = req.user._id;
    const campground = await Campground.findById(req.params.id);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'You made a review!');
    res.redirect(`/campgrounds/${campground.id}`);
};


const deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'You deleted the review');
    res.redirect(`/campgrounds/${id}`);
};

export { submitNewReview, deleteReview }

