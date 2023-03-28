
//Crea un error personalizado con los campos "message" y "statusCode" que luego serán usados por...
class ExpressError extends Error {
    constructor(message, statusCode) {
        super();
        this.message = message;
        this.statusCode = statusCode;
    }
}

export default ExpressError