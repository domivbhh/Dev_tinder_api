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

module.exports=validateSignUp