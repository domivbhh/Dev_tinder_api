const Connection = require("../models/connectionModel")
const User = require("../models/userModel")

const sendingRequest=async(req,res)=>{
    //interested,ignored
    try {
        const loggedInUser=req.user 
        const status=req.params.status
        const toUserId=req.params.toUserId


        const existingUser=await User.findById(toUserId)
        if(!existingUser){
            throw new Error('User not found')
        }

        if(!['interested','ignored'].includes(status)){
            throw new Error('Invalid status type'+" "+status)
        }

        // if(loggedInUser._id.toString()===toUserId.toString()){
        //     throw new Error('Invalid request')
        // }   

        const existingConnection=await Connection.findOne({$or:[{fromUserId:loggedInUser._id,toUserId:toUserId},{fromUserId:toUserId,toUserId:loggedInUser._id}]})
        if(existingConnection){
            throw new Error('Connection already exists')
        }

        const newConnection=new Connection({
            fromUserId:loggedInUser._id,
            toUserId:toUserId,
            status:status
        })        
        await newConnection.save()
        if(status==='interested'){
        res
          .status(200)
          .json({
            message:loggedInUser.firstName+" "+
              "was interested in" +
              " " +
              existingUser.firstName,
          });

        }
        if(status==='ignored'){
        res
          .status(200)
          .json({
            message:
              existingUser.firstName+" "+"Connection was ignored" 
          });

        }
    
    } 
    catch (error) {
            res.status(400).json({message:error.message})    
    }
}


const reviewRequest=async(req,res)=>{
    try {
        const loggedInUser=req.user
        const status=req.params.status
        const requestId=req.params.requestId


        const isAllowed=['accepted','ignored'].includes(status)

        if(!isAllowed){
            throw new Error('Status not allowed')
        }

        const connectionRequest=await Connection.find({_id:requestId,toUserId:loggedInUser._id,status:"interested"})

        if(!connectionRequest){
            return res.status(400).json({message:"Connection request not found"})
        }


        connectionRequest[0].status=status
        const data=await connectionRequest[0].save()
        res.status(200).json({message:'connection request'+" "+status,data})

    } 
    catch (error) {
     res.status(400).json({message:error.message})   
    }
}

module.exports={sendingRequest,reviewRequest}