import mongoose from 'mongoose'
import Review from './reviews.js'

const Schema=mongoose.Schema

// Definimos el esquema de image por separado para poder agregarle la propiedad virtual
const ImageSchema=new Schema({
    url: String,
    filename: String,
})

//get, de "getter" (como en getters and setters)
ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200')
})

const opts={ toJSON: { virtuals: true } }

const CampgroundSchema=new Schema({
    title: String,
    images: [ImageSchema],
    price: Number,
    description: String,
    geometry: { // Geo Json --> A type of Json very common for geo. Much bigger than just mapbox
        type: {
            type: String,
            enum: ["Point"],
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts)

CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }

})
//add a virtual to the campground schema to get the link to the campground page
CampgroundSchema.virtual('link').get(function () {
    return `/campgrounds/${this._id}`
})
CampgroundSchema.virtual('properties.popup').get(function () {
    return `<h5>${this.title}</h5>
    <image src="${this.images[0].thumbnail}" alt="campground image">
    <p>${this.location}</p>  <a href="/campgrounds/${this._id}">View Campground</a>
    <p>${this.description.substring(0, 40)}...</p>`
})



const Campground=mongoose.model('Campground', CampgroundSchema);

export default Campground