
import mongoose from "../db/db.js";
const QutySchema = new mongoose.Schema({
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
    value1: {
        type:Number,
        required:true 
    },
    value2: {
        type:Number,
        required:true
    },   
    value3: {
        type:Number,
        required:true
     },
    value4:{ 
        type:Number,
        required:true
     },
    uom:{
        type:String,
        required:true
    },
    timestamp: { type: Date, default: Date.now },
});

QutySchema.virtual('AccQty_id').get(function () {
    return this._id.toString();
  });
  

const qAQtyModel = mongoose.model("accessQty", QutySchema);

export default qAQtyModel