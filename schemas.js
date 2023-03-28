import baseJoi from "joi"
import sanitizeHtml from "sanitize-html"

// JOI Valida el esquema una vez pasado el formulario pero ANTES de que llegue a Mongoose

// Create a JOI extension to sanitize html
const extension=(joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean=sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {}
                })
                if (clean!==value) return helpers.error('string.escapeHTML', { value })
                return clean
            }
        }
    }
})

const Joi=baseJoi.extend(extension) // Extends the base Joi with the extension

const campgroundSchema=Joi.object({ // Defines the schema for the campground after extending Joi
    campground: Joi.object({
        title: Joi.string().required().escapeHTML(),
        price: Joi.number().required().min(0),
        images: Joi.array().items(Joi.object({
            url: Joi.string(),
            filename: Joi.string()
        })).optional(),
        location: Joi.string().required().escapeHTML(),
        description: Joi.string().required().escapeHTML(),
    }).required(),
    deleteImages: Joi.array().optional()
})

const reviewSchema=Joi.object({
    review: Joi.object({
        body: Joi.string().required().escapeHTML(),
        rating: Joi.number().required().min(1).max(5)
    }).required()
})



export { campgroundSchema, reviewSchema }