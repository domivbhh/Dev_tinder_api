const mongoose=require('mongoose');
const ConnectDb=async()=>{
        await mongoose.connect(
          "mongodb+srv://hariharanvbit123:vb.123@cluster0.xjbuc.mongodb.net/Dev_tinder?retryWrites=true&w=majority&appName=Cluster0"
        ); 
}

module.exports=ConnectDb