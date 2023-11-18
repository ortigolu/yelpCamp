const User = require("../models/user");

module.exports.renderRegister = (req, res) => {
  res.render("users/register");
};

module.exports.register = async (req, res, next) => {
  //Se crea una constante que va a ser el usuario
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    //Se registra el usuario
    const registeredUser = await User.register(user, password);
    //Se loguea el usuario
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      //Se crea un mensaje flash
      req.flash("success", "Welcome to Yelp Camp!");
      //Se redirecciona a la pagina de campgrounds
      res.redirect("/campgrounds");
    });
  } catch (e) {
    //Se crea un mensaje flash
    req.flash("error", e.message);
    //Se redirecciona a la pagina de register
    res.redirect("/register");
  }
};

module.exports.renderLogin = (req, res) => {
  res.render("users/login");
};

module.exports.login = (req, res) => {
  //Se crea un mensaje flash
  req.flash("success", "Welcome back!");
  //Se crea una constante que va a ser el path
  const redirectUrl = req.session.returnTo || "/campgrounds";
  //Se redirecciona a la pagina de campgrounds
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Goodbye!");
    res.redirect("/campgrounds");
  });
};
