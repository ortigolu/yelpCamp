const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Campground = require("../models/campground");
const { campgroundSchema } = require("../schemas.js");

const validateCampground = (req, res, next) => {
  //Se crea una constante que va a ser el resultado de validar los datos
  const { error } = campgroundSchema.validate(req.body);
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

//Se crea una ruta
router.get(
  "/",
  catchAsync(async (req, res) => {
    //   res.send("Bienvenido a mi sitio");
    //Se crea una constante que va a ser todos los campamentos
    const campgrounds = await Campground.find({});
    //Se renderiza la pagina de campgrounds
    res.render("campgrounds/index", { campgrounds });
  })
);

router.get(
  "/new",
  catchAsync(async (req, res) => {
    //Se renderiza la pagina de new
    res.render("campgrounds/new");
  })
);

router.post(
  "/",
  validateCampground,
  catchAsync(async (req, res) => {
    // if (!req.body.campground)
    //   throw new ExpressError("Invalid Campground Data", 400);
    //Se crea una constante que va a ser el campamento
    const campground = new Campground(req.body.campground);
    //Se guarda el campamento y se utiliza el await para que espere a que se guarde
    await campground.save();
    //Se crea un mensaje flash
    req.flash("success", "Successfully made a new campground!");
    //Se redirecciona a la pagina de show
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    //Se crea una constante que va a ser todos los campamentos
    const campground = await Campground.findById(req.params.id).populate(
      "reviews"
    );
    if (!campground) {
      req.flash("error", "Cannot find that campground!");
      return res.redirect("/campgrounds");
    }
    // console.log(campground);
    //Se renderiza la pagina de show
    res.render("campgrounds/show", { campground });
  })
);

router.get(
  "/:id/edit",
  catchAsync(async (req, res) => {
    //Se crea una constante que va a ser todos los campamentos
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
      req.flash("error", "Cannot find that campground!");
      return res.redirect("/campgrounds");
    }
    //Se renderiza la pagina de edit
    res.render("campgrounds/edit", { campground });
  })
);

router.put(
  "/:id",
  validateCampground,
  catchAsync(async (req, res) => {
    //Verificando si funciona
    //   res.send("It worked");
    //Se crea una constante que va a ser el campamento
    const { id } = req.params;
    //Se actualiza el campamento
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    req.flash("success", "Successfully updated campground!");
    //Se redirecciona a la pagina de show
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.delete(
  "/:id",
  catchAsync(async (req, res) => {
    //Se crea una constante que va a ser el campamento
    const { id } = req.params;
    //Se elimina el campamento
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted campground");
    //Se redirecciona a la pagina de campgrounds
    res.redirect("/campgrounds");
  })
);

module.exports = router;
