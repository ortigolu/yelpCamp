//Se requiere mogoose para poder utilizarlo
const mongoose = require("mongoose");
const { campgroundSchema } = require("../schemas");
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

//Se realiza una accion antes de eliminar un documento
CampgroundSchema.post("findOneAndDelete", async function (doc) {
  //Si hay un documento
  if (doc) {
    //Se elimina el documento
    await Review.deleteMany({
      //Se crea una constante que va a ser el id del review
      _id: {
        //Se crea una constante que va a ser el id del review
        $in: doc.reviews,
      },
    });
  }
});

//Se exporta el modulo para poder utilizarlo en otros archivos
module.exports = mongoose.model("Campground", CampgroundSchema);
