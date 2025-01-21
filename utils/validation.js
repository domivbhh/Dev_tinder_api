const validator=require('validator');

const validateSignUp=(req)=>{
        const{firstName,lastName,emailId,password}=req.body

        if(!firstName || !lastName || !emailId || !password){
            throw new Error('Please enter all the fields')
        }
        else if(!validator.isEmail(emailId)){
        throw new Error('Invalid email')
        }
        else if(!validator.isStrongPassword(password)){
            throw new Error('Password is weak')
        }
}


const validateUpdate=(req)=>{
   const {photoUrl, firstName, lastName} = req.body;

  
    if(firstName && firstName.length<3 || firstName && firstName.length>40){
       throw new Error('First name should be more than 3 and less than 40')
   }
   else if(lastName && lastName.length<3 || lastName && lastName.length>40){
       throw new Error(' last name should be more than 3 and less than 40')
   }
   else if(photoUrl && !validator.isURL(photoUrl)){
       throw new Error('Invalid URL')
   }    
}

module.exports={validateSignUp,validateUpdate}