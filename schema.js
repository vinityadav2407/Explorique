const Joi = require("joi");

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        discription: Joi.string().required(), // you may want to correct spelling to 'description'
        price: Joi.number().required().min(0),
        location: Joi.string().required(),
        country: Joi.string().required(),
        image: Joi.object({
            url: Joi.string().required(),
            filename: Joi.string().required()
        }).required()
    }).required()
});

module.exports.reviewSchema=Joi.object({
    review:Joi.object({
        rating:Joi.string().min(1).max(5).required(),
        comment:Joi.string().required(),
    }).required()
});
