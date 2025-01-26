const { connection } = require("mongoose")
const Connection = require("../models/connectionModel");
const User = require("../models/userModel");

const getConnections=async(req,res,next)=>{
    try {
        const loggedInUser=req.user
    
        const connection = await Connection.find({
          $or: [
            { fromUserId: loggedInUser._id, status: "accepted"},
            { toUserId: loggedInUser._id, status: "accepted"},
          ],
        }).populate(`fromUserId toUserId`,["firstName","lastName",'gender','about',"photoUrl","age"]);
        // console.log(connection)
        if(connection.length>0){
            const data=connection.map((ele)=>ele.fromUserId._id.toString()===loggedInUser._id.toString()?ele.toUserId:ele.fromUserId)
            res.status(200).json({
                data
            })
        }
        else{
            // throw new Error("No connections found")
            res.status(200).json({
              message:"No Connections Found"
            })
        }
        }
    catch (error) {
        res.status(400).json({message:error.message})
    }
}

const givenRequest = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const pendingRequest = await Connection.find({
      fromUserId: loggedInUser._id,
      status: "interested",
    }).populate("toUserId", [
      "firstName",
      "lastName",
      "gender",
      "photoUrl",
      "about",
    ]);

    // console.log(pendingRequest);

    if (pendingRequest.length > 0) {
      res.status(200).json({ data: pendingRequest });
    } else {
      // throw new Error();
      res.status(200).json({
        message: "No request received",
      });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const pendingRequest=async(req,res)=>{
    try {
        const loggedInUser=req.user    
        const pendingRequest=await Connection.find({toUserId:loggedInUser._id,status:"interested"}).populate('fromUserId',['firstName','lastName','gender','photoUrl','about'])

        // console.log(pendingRequest)

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
        let loggedInUser=req.user   
        let limit=req.query.limit || 5
        const page=req.query.page || 1


        if(limit>10){
            limit=10
        }

        const skip=(page-1)*limit
        // console.log(page,limit)

        const connections=await Connection.find({$or:[{fromUserId:loggedInUser._id},{toUserId:loggedInUser._id}]}).select('fromUserId toUserId')

        
        
        const hideUser=connections.map((ele)=>ele.fromUserId.toString()===loggedInUser._id.toString()?ele.toUserId:ele.fromUserId)
        

        const feed=await User.find().select('firstName lastName gender about photoUrl').skip(skip).limit(limit)

        const feedUser=feed.filter((ele)=>!hideUser.toString().includes(ele._id.toString()))

        const result=feedUser.filter((ele)=>ele._id.toString()!==loggedInUser._id.toString())


        if (result.length < 1) {
          throw new Error("No users Found");
        }
        

        res.status(200).json({
                count:result.length,
                data:result
        })

        // const hideUserFromFeed=new Set()

        // connections.forEach((ele)=>{
        //     hideUserFromFeed.add(ele.fromUserId.toString())
        //     hideUserFromFeed.add(ele.toUserId.toString())
        // })

        // console.log(hideUserFromFeed)

        
    } 
    catch (error) {
        res.status(400).json({ message: error.message });   
    }
}




module.exports={getConnections,pendingRequest,getFeed,givenRequest}