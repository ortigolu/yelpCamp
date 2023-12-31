if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

console.log(process.env.SECRET);

//Lo primero es requeriri express para utilizarlo
const express = require("express");
//Se requiere path para poder utilizarlo
const path = require("path");
//Se requiere mogoose para poder utilizarlo
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
//Se requiere method-override para poder utilizarlo
const methodOverride = require("method-override");
//Se requiere passport para poder utilizarlo
const passport = require("passport");
//Se requiere passport-local para poder utilizarlo
const LocalStrategy = require("passport-local");
const User = require("./models/user");
//Se requiere el modelo de ExpressError para poder utilizarlo
const ExpressError = require("./utils/ExpressError");
//Se requiere el modelo de review para poder utilizarlo
const engine = require("ejs-mate");
//Se requiere el modelo de review para poder utilizarlo
const mongoSanitize = require("express-mongo-sanitize");

const userRoutes = require("./routes/users");
const campgrounds = require("./routes/campgrounds");
const reviews = require("./routes/reviews");

//Se conecta a la base de datos y crea una nueva base de datos
mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//Se crea una constante que va a ser la conexion a la base de datos
const db = mongoose.connection;
//Si hay un error en la conexion a la base de datos
db.on("error", console.error.bind(console, "connection error:"));
//Si se conecta a la base de datos
db.once("open", () => {
  console.log("Database connected");
});

//Luego se crea una constante que va a ser el servidor
const app = express();
//Se crea una carpeta publica para que el servidor pueda acceder a ella
//Se utiliza el engine
app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
//Se utiliza el method-override
app.use(methodOverride("_method"));

app.use(express.static(path.join(__dirname, "public")));
app.use(
  mongoSanitize({
    replaceWith: "_",
  })
);

const sessionConfig = {
  name: "session",
  //Se crea una constante que va a ser el secreto
  secret: "thisshouldbeabettersecret!",
  //Se crea una constante que va a ser si se debe resavear
  resave: false,
  //Se crea una constante que va a ser si se debe inicializar
  saveUninitialized: true,
  //Se crea una constante que va a ser el tiempo de vida de la cookie
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
//Se inicializa session
app.use(session(sessionConfig));
//Se inicializa flash
app.use(flash());

//Se inicializa passport
app.use(passport.initialize());
//Se inicializa passport.session
app.use(passport.session());
//Se utiliza passport para que pueda utilizar el modelo de User
passport.use(new LocalStrategy(User.authenticate()));
//Se utiliza passport para que pueda utilizar el modelo de User
passport.serializeUser(User.serializeUser());
//Se utiliza passport para que pueda utilizar el modelo de User
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  console.log(req.session);
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// app.get("/fakeUser", async (req, res) => {
//   const user = new User({ email: "lucas@gmail.com", username: "lucas" });
//   const newUser = await User.register(user, "chicken");
//   res.send(newUser);
// });

//Se crea una ruta
app.use("/", userRoutes);
app.use("/campgrounds", campgrounds);
app.use("/campgrounds/:id/reviews", reviews);

//Se crea una ruta
app.get("/", (req, res) => {
  //   res.send("Bienvenido a mi sitio");
  res.render("home");
});
//
app.all("*", (req, res, next) => {
  //   res.send("404!!!");
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh no, Something Went Wrong!";

  res.status(statusCode).render("error", { err });
});

// //Se crea una ruta
// app.get("/campground", async (req, res) => {
//   //Se crea una constante que va a ser todos los campamentos
//   const camp = new Campground({
//     title: "My Backyard",
//     description: "cheap camping",
//   });
//   //Se guarda el campamento y se utiliza el await para que espere a que se guarde
//   await camp.save();
//   res.send(camp);
// });

//Se crea una constante que va a ser el puerto
app.listen(3000, () => {
  console.log("Servidor corriendo en el puerto 3000");
});
