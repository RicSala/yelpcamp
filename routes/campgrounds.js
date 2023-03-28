import '../config.js';

import express from "express";
import { submitNewCampground, renderCampgroundForm, renderCampgroundIndex, renderCampground, updateCampground, deleteCampground, renderUpdateCampground } from "../controllers/campgrounds.js";
import { isAuthor, isLoggedin, validateCampground } from "../middleware.js";
import multer from "multer";
import { storage } from '../cloudinary/index.js'


const upload = multer({ storage })


import catchAsync from "../utils/catchAsync.js";

const router = express.Router({ mergeParams: true }) // mergerParams: True -> inherit params of parent router

router.route('/')
    .post(isLoggedin, upload.array('image'), validateCampground, catchAsync(submitNewCampground)) //route with middlewares (isloggedin, upload, validateC)
    .get(renderCampgroundIndex)

router.get('/new', isLoggedin, renderCampgroundForm)

router.route('/:id')
    .get(catchAsync(renderCampground))
    .put(isLoggedin, isAuthor, upload.array('images'), validateCampground, catchAsync(updateCampground))
    .delete(isLoggedin, isAuthor, catchAsync(deleteCampground))

router.get('/:id/edit', isLoggedin, isAuthor, catchAsync(renderUpdateCampground))

export default router

