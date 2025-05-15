
import mongoose from "../db/db.js";
const newSchema = new mongoose.Schema({
    org_id: {
      type:String,
      required:false 
    },
    admin_id: {
      type:String,
      required:false 
    },
    company_id: {
     type:String,
     required:true 
    },
    description:{
        type: String,
        required: true
    },
    amount : {
        type: Number,
        required: true
    },
    timestamp: { type: Date, default: Date.now },
  
  },{ versionKey: false });
  
  newSchema.virtual('coupon_id').get(function () {
    return this._id.toString();
  });
  
  const Coupon = mongoose.model("coupon", newSchema);

export default Coupon