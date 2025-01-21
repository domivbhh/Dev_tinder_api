const mongoose=require('mongoose');

const connectionSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref:"User"
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref:"User"
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

const Connection=mongoose.model('Connections',connectionSchema)
module.exports=Connection