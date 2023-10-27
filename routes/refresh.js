const express = require("express");
const handleRefreshToken = require("../controllers/refreashTokenController");
const router = express.Router();

router.route("/")
    .get(handleRefreshToken)




module.exports = router;