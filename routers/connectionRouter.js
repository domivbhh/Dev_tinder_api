const express = require("express");
const authenticate = require("../utils/authenticate");
const {sendingRequest, reviewRequest}=require('../controllers/connectionControllers')


const router=express.Router()

router.post('/request/send/:status/:toUserId',authenticate,sendingRequest)
router.post('/request/review/:status/:requestId',authenticate,reviewRequest)




module.exports=router