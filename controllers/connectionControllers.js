const Connection = require("../models/connectionModel")

const sendingRequest=async(req,res)=>{
    //interested,ignored
    try {
        const loggedInUser=req.user 
        const status=req.params.status
        const toUserId=req.params.toUserId

        if(!['interested','ignored'].includes(status)){
            throw new Error('Invalid status type'+" "+status)
        }

        if(loggedInUser._id.toString()===toUserId.toString()){
            throw new Error('Invalid request')
        }   

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
        res.status(200).json({message:'Connection Request sent successfully'})
    
    } 
    catch (error) {
            res.status(400).json({message:error.message})    
    }
}

module.exports={sendingRequest}