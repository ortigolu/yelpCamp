const Campground = require("../models/campground");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  //Se crea un mensaje flash
  req.flash("success", "Created new review!");
  //Se redirecciona a la pagina de show
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteReview = async (req, res) => {
  //Se crea una constante que va a ser el id del campamento
  const { id, reviewId } = req.params;
  //Se elimina el review
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  //Se elimina el review
  await Review.findByIdAndDelete(reviewId);
  //Se crea un mensaje flash
  req.flash("success", "Successfully deleted review!");
  //Se redirecciona a la pagina de show
  res.redirect(`/campgrounds/${id}`);
};
