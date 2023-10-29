const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Se crea una constante que va a ser el esquema de mongoose
const reviewSchema = new Schema({
  body: String,
  rating: Number,
});

//Se exporta el modulo para poder utilizarlo en otros archivos
module.exports = mongoose.model("Review", reviewSchema);
