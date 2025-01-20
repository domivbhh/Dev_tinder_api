const express=require('express')
const dotenv=require('dotenv')
const ConnectDb = require('./ConnectDb')
const userRouter=require('./routers/userRouter')


//intialize express
const app=express()
dotenv.config()
 
app.use(express.json())   

app.use('/user',userRouter)


 



ConnectDb().then(()=>{
    console.log('Db connected')
    app.listen(3000, () => {
      console.log("server is listening to port 3000");
    });
}).catch((err)=>{    
    console.log('Database cannot be connected',err.message)
})