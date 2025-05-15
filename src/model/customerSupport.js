import mongoose from "../db/db.js";
const newSchema  =new mongoose.Schema({

    taskType: { 
        type: String, 
        required: true 
    },
    problemType: { 
        type: String, 
        unique: true, 
        required: true 
    },
    seriol_No:{
        type: String, 
        required: false 
    },
    contact_No:{
        type: Number, 
        required: false 
    },
    email:{
        type: String, 
        required: false 
    },
    summary:{
        type: String, 
        required: false 
    },
    timestamp: { type: Date, default: Date.now },
},{ versionKey: false });

newSchema.virtual('cSupport_id').get(function(){
    return this._id.toString();
  })

const customerSupport = mongoose.model("customerSupport", newSchema )

export default customerSupport