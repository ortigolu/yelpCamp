//Se requiere mogoose para poder utilizarlo
const mongoose = require("mongoose");
//Se crea una constante que va a ser el esquema de mongoose
const Schema = mongoose.Schema;

//Se crea una constante que va a ser el esquema de la base de datos
const CampgroundSchema = new Schema({
  title: String,
  image: String,
  price: Number,
  description: String,
  location: String,
  reviews: [
    //Se crea una constante que va a ser el tipo de dato que va a ser el review
    {
      type: Schema.Types.ObjectId,
      //Se crea una constante que va a ser el modelo de review
      ref: "Review",
    },
  ],
});

//Se exporta el modulo para poder utilizarlo en otros archivos
module.exports = mongoose.model("Campground", CampgroundSchema);
