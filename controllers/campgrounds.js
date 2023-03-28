import Campground from "../models/campground.js"
import catchAsync from "../utils/catchAsync.js"
import mbxGeocodingFactory from '@mapbox/mapbox-sdk/services/geocoding.js';
import mbxClient from '@mapbox/mapbox-sdk';

const mapBoxToken = process.env.MAPBOX_TOKEN;

const baseClient = mbxClient({ accessToken: mapBoxToken });
const geoCoder = mbxGeocodingFactory(baseClient);


const submitNewCampground = async (req, res, next) => {
    //en el body van los inputs del form MENOS los archivos, que van en req.files!
    const geoData = await geoCoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1,

    }).send()

    let newCampground = req.body.campground
    const images = req.files.map((f) => ({ url: f.path, filename: f.filename }))
    newCampground = new Campground({ author: req.user._id, ...newCampground })
    newCampground.geometry = geoData.body.features[0].geometry
    newCampground.images = images
    await newCampground.save()
    req.flash('success', 'You succesfully make a new campgroud')
    res.redirect(`campgrounds/${newCampground.id}`)
}


const renderCampgroundForm = (req, res) => {
    res.render('campgrounds/new')
}

const renderCampgroundIndex = catchAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds', { campgrounds })
})

const renderCampground = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author'); // populates the fields: i) author of the campground and ii) author of each review
    if (!campground) {
        req.flash('error', 'Cannot find that campground');
        return res.redirect('/campgrounds');
    }
    // res.render('campgrounds/show', { campground })
    res.render('campgrounds/show', { campground });
};

const updateCampground = async (req, res, next) => {
    const geoData = await geoCoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1,
    }).send()

    const { id } = req.params;
    const deleteImages = req.body.deleteImages;
    const newCampground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const newImages = req.files.map((file) => ({ url: file.path, filename: file.filename }))
    newCampground.images.push(...newImages)
    newCampground.geometry = geoData.body.features[0].geometry
    newCampground.save()
    if (deleteImages) {
        // for (let image of deleteImages) {
        //     await cloudinary.uploader.destroy(image)
        // }
        await Campground.updateOne({ _id: id }, { $pull: { images: { filename: { $in: deleteImages } } } })
    }
    req.flash('success', 'You succesfully updated the campground');
    res.redirect(`/campgrounds/${id}`);
};

const deleteCampground = async (req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'You succesfully deleted the campground');
    res.redirect('/campgrounds');
};

const renderUpdateCampground = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Cannot find that campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
};

export { submitNewCampground, renderCampgroundForm, renderCampgroundIndex, renderCampground, updateCampground, deleteCampground, renderUpdateCampground }