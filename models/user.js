const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

//Se crea un nuevo esquema de usuario
const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

//Se agrega el plugin de passportLocalMongoose al esquema de usuario
UserSchema.plugin(passportLocalMongoose);

//Se exporta el modelo de usuario
module.exports = mongoose.model("User", UserSchema);
