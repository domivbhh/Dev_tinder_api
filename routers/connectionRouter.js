const express = require("express");
const sendConnectionRequest = require("../controllers/connectionControllers");
const authenticate = require("../utils/authenticate");


const router=express.Router()


router.post('/sendconnection',authenticate,sendConnectionRequest)


module.exports=router