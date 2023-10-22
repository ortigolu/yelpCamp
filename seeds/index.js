//Se requiere mogoose para poder utilizarlo
const mongoose = require("mongoose");
//Se requiere el modelo de campground para poder utilizarlo
const Campground = require("./../models/campground");
//Se requiere el modelo de cities para poder utilizarlo
const cities = require("./cities");
//Se requiere el modelo de places para poder utilizarlo
const { places, descriptors } = require("./seedHelpers");

//Se conecta a la base de datos y crea una nueva base de datos
mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//Se crea una constante que va a ser la conexion    a la base de datos
const db = mongoose.connection;
//Si hay un error en la conexion a la base de datos
db.on("error", console.error.bind(console, "connection error:"));
//Si se conecta a la base de datos
db.once("open", () => {
  console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

//Se crea una constante que va a ser un arreglo de strings
const seedDB = async () => {
  //Se elimina todo lo que hay en la base de datos
  await Campground.deleteMany({});
  //Se crea un for loop que se va a repetir 50 veces
  for (let i = 0; i < 50; i++) {
    //Se crea una constante que va a ser un numero random entre 0 y 1000
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: "https://source.unsplash.com/collection/483251",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis quas voluptatibus delectus quae! Atque, alias quaerat odio in eos culpa reiciendis, fugit explicabo dolorem corporis autem, ex fuga! Ex, consectetur.",
      price,
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
