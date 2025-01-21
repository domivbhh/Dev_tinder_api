const express=require('express')
const dotenv=require('dotenv')
const ConnectDb = require('./ConnectDb')
const userRouter=require('./routers/userRouter')
const cookieParser=require('cookie-parser')
const connectionRouter=require('./routers/connectionRouter')


//intialize express
const app=express()
app.use(cookieParser())
dotenv.config()
 
app.use(express.json())   



app.use('/user',userRouter)
app.use('/connection',connectionRouter)


 



ConnectDb().then(()=>{
    console.log('Db connected')
    app.listen(3000, () => {
      console.log("server is listening to port 3000");
    });
}).catch((err)=>{    
    console.log('Database cannot be connected',err.message)
})