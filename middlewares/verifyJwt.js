const jwt = require("jsonwebtoken");

const verifyJWT = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    // console.log(`authHeader : ${authHeader}`);
    if (!authHeader) return res.sendStatus(401);
    // console.log(authHeader);
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decode) => {
        if (err) return res.sendStatus(412)
        req.user = decode.username;
        req.token = token;
        next();
    });

}

module.exports = verifyJWT;