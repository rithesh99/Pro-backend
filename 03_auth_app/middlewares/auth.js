const jwt = require('jsonwebtoken');

//model is optional


const auth = (req, res, next) => {
    const token = (req.headers['authorization'] && req.headers['authorization'].replace('Bearer ', ''))
        || (req.cookies && req.cookies['token'])
        || (req.body && req.body.token);

    if (!token) {
        return res.status(403).send("Token is missing");
    }
    try {
        const decode = jwt.verify(token, process.env.SECRET);
        req.user = decode;
    } catch (error) {
        return res.status(401).send("Invalid token")
    }
    console.log(token)
    next();
}


module.exports = auth
