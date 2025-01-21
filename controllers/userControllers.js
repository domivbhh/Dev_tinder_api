const User = require("../models/userModel");
const bcrypt=require('bcryptjs');
const validateSignUp = require("../utils/validation");
const jwt=require('jsonwebtoken')


const signUp=async(req,res)=>{
    try {
        const{firstName,lastName,emailId,age,gender,password}=req.body

        validateSignUp(req)
        let hashPassword
        if(password){
            hashPassword=await bcrypt.hash(password,10)
        }

        const user=new User({
            firstName,
            lastName,
            password:hashPassword,
            emailId,
            age,gender })
        await user.save()
        res.status(201).json({message:'User created successfully',user})      
    } 
    catch (error) {
        res.status(500).json({message:'User cannot be created',error:error.message})
    }
}



const signIn=async(req,res)=>{
    try {
        const {emailId,password}=req.body
        if(!emailId || !password){
            return res.status(400).json({message:'Please enter email and password'})
        }
        const verifyEmail=await User.find({emailId})
        if(verifyEmail){
            const verifyPassword=await bcrypt.compare(password,verifyEmail[0].password)
            if(verifyPassword){
                const jwtToken=await jwt.sign({_id:verifyEmail[0]._id},process.env.JWT_SECRET,{expiresIn:'1d'})
                res.cookie("token",jwtToken,{expires:new Date(Date.now()+8*3600000)}).status(200).json({message:'User logged in successfully'})
            }
            else{
                res.status(400).json({message:'Invalid credentials'})
            }
        }
        else{
            res.status(400).json({message:'Invalid crdentials'})
        }
    } 
    catch (error) {
        res.status(500).json({message:'User cannot be logged in',error:error.message})
    }
}



const getUsers=async(req,res)=>{
    try {
        const users=await User.find({}).select('-password -__v')
        if(users.length!==0){
            res.status(200).json({message:'User fetched successfully',data:users})
        }
    } 
    catch (error) {
        res.status(500).json({message:'Error while fetching data',error:error.message})
    }
}



const getProfile=async(req,res)=>{
    try {
        const profile=(req.user)
        
        res.status(200).json({message:'User fetched successfully',data:profile})
    } 
    catch (error) {
        res.status(500)
          .json({ message: "Error while fetching data", error: error.message });
        
    }
}



const deletUser=async(req,res)=>{
    try {
        const {id}=req.params
        const user=await User.findByIdAndDelete(id)
        if(user){
            res.status(200).json({message:user.firstName+'deleted successfully'})
        }
        else{
            res.status(404).json({message:'User not found'})
        }
    }
catch(error){
    res.status(500).json({message:'Error while deleting data',error:error.message}) 
}
}



const updateUser=async(req,res)=>{
    try {
        const {id}=req.params
        const{emailId,firstName,skills,lastName,age,gender}=req.body
        const allowedUpdates=['firstName','lastName','age','gender',"photoUrl","skills"]
        
        const isValidOperation=Object.keys(req.body).every((update)=>allowedUpdates.includes(update))
        const isValidSkills=skills.length<=5

        if(isValidOperation && isValidSkills){
            const updateUser=await User.findByIdAndUpdate({_id:id},req.body,{new:true,runValidators:true})
            res.status(200).json({message:'User updated successfully',data:updateUser})
        }
        else{
            res.status(400).json({message:'Invalid updates'})
        }

    } 
    catch (error) {
    res.status(500).json({ message: "Error while deleting data", error: error.message });
    }
}



module.exports={signUp,signIn,getUsers,deletUser,updateUser,getProfile}