const express = require("express");
const router = express.Router();
const { handleLogin, handleIsVerified } = require("./../controllers/authControllers");
const verifyJWT = require("../middlewares/verifyJwt");

router.route("/")
    .post(handleLogin)
    .get(verifyJWT, handleIsVerified)





module.exports = router;