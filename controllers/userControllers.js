const User = require("../models/userModel");
const bcrypt=require('bcryptjs');
const {validateSignUp,validateUpdate} = require("../utils/validation");
const jwt=require('jsonwebtoken');
const { get } = require("mongoose");

const signUp=async(req,res)=>{
    try {
        const{firstName,lastName,emailId,age,gender,password}=req.body

        validateSignUp(req)

        if(emailId){
            const emailExist=await User.findOne({emailId})
            if(emailExist){
                // return res.status(400).json({message:'Email already exists'})
                throw new Error('Email already exists')
            }
        }
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
        res.status(201).json({message:'User created successfully'})      
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
                res.cookie("token",jwtToken,{expires:new Date(Date.now()+8*3600000)}).status(200).json({message:'User logged in successfully',data:verifyEmail[0]})
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


const signOut=async(req,res)=>{
    try {
        res.cookie('token','',{expires:new Date(Date.now())}).status(200).json({message:'User logged out successfully'})    
    } 
    catch (error) {
        res.status(500).json({message:'User cannot be logged out',error:error.message})
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


const forgotPassword=async(req,res)=>{
    try {
        const {password}=req.body
        
    } 
    catch (error) {
            res.status(500).json({message:'Error in reseting the password',error:error.message})    
    }
}



const updateUser=async(req,res)=>{
    try {
        const profile=req.user
        // console.log(req.body)
        const{emailId,firstName,skills,lastName,age,gender}=req.body
        
        const allowedUpdates=['firstName','lastName','age','gender',"photoUrl","skills","about"]
        
        const isValidOperation=Object.keys(req.body).every((update)=>allowedUpdates.includes(update))
        const isValidSkills=skills?.length>=5
        
        validateUpdate(req)

        if(isValidSkills){
            return res.status(400).json({message:'Skills cannot be more than 5'})
        }

        if(isValidOperation){
            const updateUser=await User.findByIdAndUpdate({_id:profile._id},req.body,{new:true,runValidators:true})
            res.status(200).json({message:updateUser.firstName+" "+'updated successfully'})
        }
        else{
            res.status(400).json({message:'Invalid updates'})
        }

    } 
    catch (error) {
    res.status(500).json({ message: "Error while deleting data", error: error.message });
    }
}



module.exports={signUp,signIn,getUsers,deletUser,updateUser,getProfile,signOut}