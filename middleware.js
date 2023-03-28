import ExpressError from "./utils/ExpressError.js"
import { campgroundSchema, reviewSchema } from "./schemas.js"
import Campground from "./models/campground.js"
import Review from "./models/reviews.js"

const DEV = true

const isLoggedin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in')
        return res.redirect('/login')
    }
    next()
}


const validateCampground = (req, res, next) => {

    const { error } = campgroundSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

const isAuthor = async (req, res, next) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that')
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

const isReviewAuthor = async (req, res, next) => {
    const { reviewId, id } = req.params
    const review = await Review.findById(reviewId)
    if (!req.user.equals(review.author)) {
        req.flash('error', 'You do not have permission to do that')
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}

export { isLoggedin, validateCampground, isAuthor, validateReview, isReviewAuthor }