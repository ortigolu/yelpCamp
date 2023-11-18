const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Se crea una constante que va a ser el esquema de mongoose
const reviewSchema = new Schema({
  body: String,
  rating: Number,
  author: {
    //Se crea una constante que va a ser el tipo de dato que va a ser el autor
    type: Schema.Types.ObjectId,
    //Se crea una constante que va a ser el modelo de usuario
    ref: "User",
  },
});

//Se exporta el modulo para poder utilizarlo en otros archivos
module.exports = mongoose.model("Review", reviewSchema);
