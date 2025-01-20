const mongoose=require('mongoose');
const ConnectDb=async()=>{
        await mongoose.connect(process.env.MONGO_URI) 
}

module.exports=ConnectDb