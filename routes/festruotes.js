const express = require("express");
const router = express.Router();
 
const festController = require("../controllers/user.controllers");
 
// Correct usage of 'router' instead of 'route'
router.post('/', festController.createUser);
 
module.exports = router;