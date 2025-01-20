const User = require("../models/userModel");


const signUp=async(req,res)=>{
    try {
        const{firstName,lastName,emailId,age,gender,password}=req.body

        const user=new User({
            firstName,
            lastName,
            password,
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
            const verifyPassword=verifyEmail[0].password===password
            if(verifyPassword){
                res.status(200).json({message:'User logged in successfully'})
            }
            else{
                res.status(400).json({message:'Password is incorrect'})
            }
        }
        else{
            res.status(400).json({message:'Email is incorrect'})
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

const deletUser=async(req,res)=>{
    try {
        const {id}=req.params
        const user=await User.findByIdAndDelete(id)
        console.log(user)
}
catch(error){
    res.status(500).json({message:'Error while deleting data',error:error.message}) 
}
}


const updateUser=async(req,res)=>{
    try {
        const {id}=req.params
        const updateUser=await User.findByIdAndUpdate({_id:id},req.body,{new:true,runValidators:true})
        res.status(200).json({message:'User updated successfully',data:updateUser})

    } catch (error) {
    res.status(500).json({ message: "Error while deleting data", error: error.message });
    }
}



module.exports={signUp,signIn,getUsers,deletUser,updateUser}