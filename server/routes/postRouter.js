const express = require("express");
const router = express.Router();

const postController = require("../controllers/postcontroller");

router.get("/fetchpostofuser/:id", postController.fetchpostofuser);

module.exports = router;