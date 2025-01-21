const express = require("express");
const authenticate = require("../utils/authenticate");
const {sendingRequest}=require('../controllers/connectionControllers')


const router=express.Router()

router.post('/request/send/:status/:toUserId',authenticate,sendingRequest)




module.exports=router