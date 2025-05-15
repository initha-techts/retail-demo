import mongoose from "../db/db.js";
const newSchema  =new mongoose.Schema({
    org_id: {
        type:String,
        required:false 
    },
    admin_id: {
        type:String,
        required:false 
    },
    category_id:{
        type:String,
        required:false 
    },
    store_id: {
        type:String,
        required:false 
    },
    app_id: {
        type:String,
        required:true
    },
    name: { 
        type: String, 
        required: false 
    },
    mobileno: { 
        type: Number, 
        unique: true, 
        required: false 
    },
    loginName:{
        type: String, 
        required: false 
    },
    password:{
        type: String, 
        required: false 
    },
    role:{
        type: String, 
        required: false 
    },
    destination:{
        type: String, 
        required: false 
    },
    aadhar:{
        type: String, 
        required: false 
    },
    email:{
        type: String, 
        required: false 
    },
    address:{
        type: String, 
        required: false 
    },
    active:{
        type: Boolean, 
        required: false 
    },
    timestamp: { type: Date, default: Date.now },
},{ versionKey: false });

newSchema.virtual('user_id').get(function(){
    return this._id.toString();
  })

const UserModel = mongoose.model("user", newSchema )

export default UserModel