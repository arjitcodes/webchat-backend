const express = require("express");
const router = express.Router();
const { getUser, postUser, putUser, deleteUser } = require("./../controllers/userCotrollers");
const verifyJWT = require("../middlewares/verifyJwt");



router.route("/")
    .post(postUser)


router.route("/:id")
    .get(verifyJWT, getUser)
    .put(verifyJWT, putUser)
    .delete(verifyJWT, deleteUser)

module.exports = router;