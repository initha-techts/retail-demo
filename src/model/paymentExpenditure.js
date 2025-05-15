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
    timestamp: { type: Date, default: Date.now },
  
  });
  
  newSchema.virtual('Expenditure_id').get(function () {
    return this._id.toString();
  },{ versionKey: false });
  
  const payExpenditure = mongoose.model("paymentExpenditure", newSchema);

export default payExpenditure