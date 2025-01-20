const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      minLength: 3,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    emailId: {
      type: String,
      lowercase: true,   
      required: true,
      unique: true,
      trim:true
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
      validate(value){
        if(!['male','female','others'].includes(value)){
          throw new Error('Invalid gender')
      }
    }
  },
    photoUrl: {
      type: String,
      default:
        "https://w7.pngwing.com/pngs/178/595/png-transparent-user-profile-computer-icons-login-user-avatars-thumbnail.png",
    },
    about: {
      type: String,
      default: "Nothing about user",
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);


const User=mongoose.model('Users',userSchema)
module.exports=User