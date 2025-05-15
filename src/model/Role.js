
import mongoose from "../db/db.js";
const RoleSchema = new mongoose.Schema({
    org_id: {
        type:String,
        required:false 
    },
    admin_id: {
        type:String,
        required:false 
    },
    store_id: {
        type:String,
        required:true 
    },
    roleList: {
        type:String,
        required:true 
    },
    roleName: {
        type: [String],
        required:false
    }, 
     timestamp: { type: Date, default: Date.now },
},{ versionKey: false });

RoleSchema.virtual('role_id').get(function () {
    return this._id.toString();
  });
  

const Role = mongoose.model("role", RoleSchema);

export default Role