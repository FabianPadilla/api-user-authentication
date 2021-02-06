const jwt = require('jsonwebtoken')

function auth(req, res, next){
    const jwtToken = req.header('Authorization')
    if(!jwtToken) return res.status(401).send({status: 401, error: "Acceso denegado"})

    try {
        const payload = jwt.verify(jwtToken, process.env.SECRET_KEY_JWT_CAT_API)

        req.user = payload
        next()
    } catch (e) {
        const response = {
            status: 400,
            error: "Acceso denegado"
        };
        res.status(400).send(response)
    }
}

module.exports = auth