const express=require('express')
const { signUp, signIn, getUsers,deletUser,updateUser, getProfile, signOut } = require('../controllers/userControllers');
const authenticate = require('../utils/authenticate');

const router=express.Router()

router.post("/signup", signUp).post("/signin", signIn).get('/signout',signOut);
router.get("/getuser",authenticate, getUsers).get("/profile/view",authenticate, getProfile);
router.delete("/delete/:id", authenticate, deletUser);
router.patch("/profile/edit", authenticate, updateUser)



module.exports=router