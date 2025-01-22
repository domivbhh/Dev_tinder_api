const { connection } = require("mongoose")
const Connection = require("../models/connectionModel")

const getConnections=async(req,res,next)=>{
    try {
        const loggedInUser=req.user
    
        const connection = await Connection.find({
          $or: [
            { fromUserId: loggedInUser._id, status: "accepted"},
            { toUserId: loggedInUser._id, status: "accepted"},
          ],
        }).populate(`fromUserId toUserId`,["firstName","lastName",'gender','about']);
        if(connection.length>0){
            const data=connection.map((ele)=>ele.fromUserId._id.toString()===loggedInUser._id.toString()?ele.toUserId:ele.fromUserId)
            res.status(200).json({
                data
            })
        }
        else{
            throw new Error("No connections found")
        }
        }
    catch (error) {
        res.status(400).json({message:error.message})
    }
}


const pendingRequest=async(req,res)=>{
    try {
        const loggedInUser=req.user    
        const pendingRequest=await Connection.find({toUserId:loggedInUser._id,status:"interested"}).populate('fromUserId',['firstName','lastName','gender','photoUrl','about'])
        if(pendingRequest.length>0){
            res.status(200).json({data:pendingRequest})
        }
        else{
            throw new Error('No pending request')
        }
    } 
    catch (error) {
        res.status(400).json({ message: error.message });
        
    }
}


const getFeed=async(req,res)=>{
    try {
        const loggedInUser=req.user   
        const feeds=await Connection.find({}) 
    } 
    catch (error) {
        
    }
}




module.exports={getConnections,pendingRequest,getFeed}