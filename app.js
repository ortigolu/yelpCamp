//Lo primero es requeriri express para utilizarlo
const express = require("express");
//Se requiere path para poder utilizarlo
const path = require("path");
//Se requiere mogoose para poder utilizarlo
const mongoose = require("mongoose");
//Se requiere method-override para poder utilizarlo
const methodOverride = require("method-override");
//Se requiere el modelo de campground para poder utilizarlo
const Campground = require("./models/campground");

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
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
//Se utiliza el method-override
app.use(methodOverride("_method"));

//Se crea una ruta
app.get("/", (req, res) => {
  //   res.send("Bienvenido a mi sitio");
  res.render("home");
});

//Se crea una ruta
app.get("/campgrounds", async (req, res) => {
  //   res.send("Bienvenido a mi sitio");
  //Se crea una constante que va a ser todos los campamentos
  const campgrounds = await Campground.find({});
  //Se renderiza la pagina de campgrounds
  res.render("campgrounds/index", { campgrounds });
});

app.get("/campgrounds/new", async (req, res) => {
  //Se renderiza la pagina de new
  res.render("campgrounds/new");
});

app.post("/campgrounds", async (req, res) => {
  //Se crea una constante que va a ser el campamento
  const campground = new Campground(req.body.campground);
  //Se guarda el campamento y se utiliza el await para que espere a que se guarde
  await campground.save();
  //Se redirecciona a la pagina de show
  res.redirect(`/campgrounds/${campground._id}`);
});

app.get("/campgrounds/:id", async (req, res) => {
  //Se crea una constante que va a ser todos los campamentos
  const campground = await Campground.findById(req.params.id);
  //Se renderiza la pagina de show
  res.render("campgrounds/show", { campground });
});

app.get("/campgrounds/:id/edit", async (req, res) => {
  //Se crea una constante que va a ser todos los campamentos
  const campground = await Campground.findById(req.params.id);
  //Se renderiza la pagina de edit
  res.render("campgrounds/edit", { campground });
});

app.put("/campgrounds/:id", async (req, res) => {
  //Verificando si funciona
  //   res.send("It worked");
  //Se crea una constante que va a ser el campamento
  const { id } = req.params;
  //Se actualiza el campamento
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  //Se redirecciona a la pagina de show
  res.redirect(`/campgrounds/${campground._id}`);
});

app.delete("/campgrounds/:id", async (req, res) => {
  //Se crea una constante que va a ser el campamento
  const { id } = req.params;
  //Se elimina el campamento
  await Campground.findByIdAndDelete(id);
  //Se redirecciona a la pagina de campgrounds
  res.redirect("/campgrounds");
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