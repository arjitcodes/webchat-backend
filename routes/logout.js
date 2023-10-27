const express = require("express");
const handleLogout = require("../controllers/logoutController");
const router = express.Router();

router.route("/")
    .get(handleLogout)




module.exports = router;