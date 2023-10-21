//Se requiere mogoose para poder utilizarlo
const mongoose = require("mongoose");
//Se crea una constante que va a ser el esquema de mongoose
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
  title: String,
  price: Number,
  description: String,
  location: String,
});

//Se exporta el modulo para poder utilizarlo en otros archivos
module.exports = mongoose.model("Campground", CampgroundSchema);
