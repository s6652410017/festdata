const express = require("express");
const router = express.Router();
 
const userController = require("../controllers/user.controllers");
 
// Correct usage of 'router' instead of 'route'
router.post('/', userController.createUser);
 
module.exports = router;