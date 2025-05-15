
import mongoose from "../db/db.js";
const RewardSchema = new mongoose.Schema({
    amountEligible: {
        type:Number,
        required:true 
    },
    rewardPoints: {
        type:Number,
        required:true
    },   
    amountPerPoint: {
        type:Number,
        required:true
     },
    minPointsToRedeem:{ 
        type:Number,
        required:true
     },
     timestamp: { type: Date, default: Date.now },
},{ versionKey: false });

RewardSchema.virtual('reward_id').get(function () {
    return this._id.toString();
  });
  

const Reward = mongoose.model("Reward", RewardSchema);

export default Reward