import mongoose from "../db/db.js";
const supplierSchema = new mongoose.Schema({
   
    admin_id: {
        type:String,
        required:false 
    },
    store_id: {
        type:String,
        required:true 
    },
    firm_name: {
        type:String,
        required:true 
    },
    gstin: {
        type:String,
        required:true 
    },
    phone: {
        type:Number,
        required:true
    }, 
    email: {
        type:String,
        required:true
    }, 
    address: {
        type:String,
        required:true
    }, 
    active: {
        type:Boolean,
        required:true
    }, 
     timestamp: { type: Date, default: Date.now },
},{ versionKey: false });

supplierSchema.virtual('supplier_id').get(function () {
    return this._id.toString();
  });
  

const SupplierModel = mongoose.model("supplier", supplierSchema);

export default SupplierModel