
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
    chargeable : {
        type: Boolean,
        required: true
    },
    timestamp: { type: Date, default: Date.now },
  
  },{ versionKey: false });
  
  newSchema.virtual('others_id').get(function () {
    return this._id.toString();
  });
  
  const otherChanges = mongoose.model("otherChanges", newSchema);

export default otherChanges