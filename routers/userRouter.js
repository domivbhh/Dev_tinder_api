const express=require('express')
const { signUp, signIn, getUsers,deletUser,updateUser, getProfile } = require('../controllers/userControllers');
const authenticate = require('../utils/authenticate');

const router=express.Router()

router.post("/signup", signUp).post("/signin", signIn);
router.get("/getuser",authenticate, getUsers).get("/profile",authenticate, getProfile);
router.delete("/delete/:id", authenticate, deletUser);
router.patch("/update/:id", authenticate, updateUser);



module.exports=router