import mongoose from "../db/db.js";
const departmentSchema  =new mongoose.Schema({
    org_id: {
        type:String,
        required:true 
    },
    admin_id: {
        type:String,
        required:true 
    },
    company_id: {
        type:String,
        required:true 
    },
    departmentName: { 
        type: String, 
        required: true 
    },
    departmentCode: { 
        type: String, 
        unique: true, 
        required: true 
    },
    departmentLogo:{
        type: String, 
        required: false 
    },
    timestamp: { type: Date, default: Date.now },
},{ versionKey: false });

departmentSchema.virtual('dept_id').get(function(){
    return this._id.toString();
  })

const Department = mongoose.model("department", departmentSchema )

export default Department