const express = require("express");
const catchAsync = require("../utils/catchAsync");
const router = express.Router({ mergeParams: true });
const Campground = require("../models/campground");
const Review = require("../models/review");
const ExpressError = require("../utils/ExpressError");
const { reviewSchema } = require("../schemas.js");

const validateReview = (req, res, next) => {
  //Se crea una constante que va a ser el resultado de validar los datos
  const { error } = reviewSchema.validate(req.body);
  //Si hay un error
  if (error) {
    //Se crea una constante que va a ser todos los errores
    const msg = error.details.map((el) => el.message).join(",");
    //Se lanza un error
    throw new ExpressError(msg, 400);
  } else {
    //Si no hay error
    next();
  }
};

router.post(
  "/",
  validateReview,
  catchAsync(async (req, res) => {
    // res.send("It worked");
    //Se crea una constante que va a ser el campamento
    const campground = await Campground.findById(req.params.id);
    //Se crea una constante que va a ser el review
    const review = new Review(req.body.review);
    //Se agrega el review al campamento
    campground.reviews.push(review);
    //Se guarda el review
    await review.save();
    req.flash("success", "Created new review!");
    //Se guarda el campamento
    await campground.save();

    //Se redirecciona a la pagina de show
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.delete(
  "/:reviewId",
  catchAsync(async (req, res) => {
    // res.send("It worked")
    //Se crea una constante que va a ser el campamento
    const { id, reviewId } = req.params;
    //Se actualiza el campamento
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    //Se elimina el review
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted review!");
    //Se redirecciona a la pagina de show
    res.redirect(`/campgrounds/${id}`);
  })
);

module.exports = router;
