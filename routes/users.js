import express from "express";
import passport from "passport";
import { postNewUser, renderNewUserForm, renderUserLogin, submitUserLogin, submitUserLogout } from "../controllers/users.js";
import catchAsync from "../utils/catchAsync.js";

const userRoutes = express.Router()

userRoutes.route('/register')
    .get(renderNewUserForm)
    .post(catchAsync(postNewUser))

userRoutes.route('/login')
    .get(renderUserLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true }), submitUserLogin)

userRoutes.get('/logout', submitUserLogout)

export default userRoutes