
// Es una función que recibe una función (fn, que puede tener - y tiene - parametros) y la devuelve con un catch
const catchAsync = fn => {
    return (req, res, next) => {
        fn(req, res, next).catch(next)
    }
}

export default catchAsync