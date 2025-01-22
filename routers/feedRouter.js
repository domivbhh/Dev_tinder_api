const express=require('express')
const { getConnections, pendingRequest, getFeed } = require('../controllers/feedControllers')
const authenticate = require('../utils/authenticate')

const router=express.Router()

router.get('/connections',authenticate,getConnections).get('/requests',authenticate,pendingRequest).get('/feed',authenticate,getFeed)



module.exports=router