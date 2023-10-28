//Descripcion: Clase para manejar errores de Express
class ExpressError extends Error {
  //Descripcion: Constructor de la clase
  constructor(message, statusCode) {
    super();
    this.message = message;
    this.statusCode = statusCode;
  }
}

module.exports = ExpressError;
