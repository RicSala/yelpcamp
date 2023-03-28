import mongoose from "mongoose";
import passportLocalMongoose from 'passport-local-mongoose'

const Schema = mongoose.Schema

const userSchema = new Schema({
    email: {
        type: String,
        required: [true, 'please add your email'],
        unique: true
    }
})

userSchema.plugin(passportLocalMongoose); //It's gonna add username, password, additional methods...

const User = mongoose.model('User', userSchema)

export default User