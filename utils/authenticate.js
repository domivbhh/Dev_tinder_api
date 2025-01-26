const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authenticate = async(req, res, next) => {
    try {
        const{token}=req.cookies
        if(token){
            const jwtVerify=jwt.verify(token,'dominar.400')
            if(jwtVerify){
                const{_id}=jwtVerify
                const profile=await User.findById(_id).select('-password -__v')
                // console.log(profile)
                req.user=profile
                next()  
            }
        else{
            res.status(400).json({message:'Unauthenticated'})
        }
    } 
    else{
        res.status(401).json({message:'Please login again'})
    }
    }
    catch (error) {
    res.status(500).json({message:'Error while fetching data',error:error.message    
    })
}
}



module.exports = authenticate;