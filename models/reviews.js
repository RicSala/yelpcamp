import mongoose from "mongoose";
const { Schema } = mongoose

const reviewSchema = new Schema({
    body: String,
    rating: Number,
    author: {
        // referencia a un objeto que tiene definido su propio esquema (¿y modelo?)
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
})

const Review = mongoose.model('Review', reviewSchema)

export default Review