const mongoose=require('mongoose');

const connectionSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref:"Users"
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref:"Users"
    },
    status: {
      type: String,
      enum: {
        values: ["interested", "accepted", "ignored", "rejected"],
        message: `{VALUE} is not supported`,
      },
      required: true,
    },
  },
  { timestamps: true }
);

connectionSchema.index({fromUserId:1,toUserId:1}) 


connectionSchema.pre('save',async function(next){
    const connection=this
    if(connection.fromUserId.equals(connection.toUserId)){
        throw new Error('Cannot send request to yourself')
    }
    next()
})


const Connection=mongoose.model('Connections',connectionSchema)
module.exports=Connection