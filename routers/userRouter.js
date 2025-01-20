const express=require('express')
const { signUp, signIn, getUsers,deletUser,updateUser } = require('../controllers/userControllers')

const router=express.Router()

router.post("/signup", signUp).post("/signin", signIn);
router.get('/getuser',getUsers)
router.delete('/delete/:id',deletUser)
router.patch('/update/:id',updateUser)



module.exports=router