const express = require("express");
const { urlShorten } = require("./controllers/urlController");
const router = express.Router();

router.post("/url/shorten", urlShorten);


module.exports = router