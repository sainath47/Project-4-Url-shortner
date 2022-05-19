const express = require("express");
const { urlShorten, redirect } = require("../controllers/urlController");
const router = express.Router();

router.post("/url/shorten", urlShorten);
router.get("/:urlCode",redirect)

module.exports = router

