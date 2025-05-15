import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
    admin_id: { 
        type: String, 
        required: false 
    },
    org_id: { 
        type: String, 
        required: false 
    },
    store_name: { 
        type: String, 
        required: false 
    },
    phoneNumber: { 
        type: Number, 
        required: false 
    },
    email: { 
        type: String, 
        required: false 
    },
    address: { 
        type: String, 
        required: false 
    },
    city: { 
        type: String, 
        required: false 
    },
    state: { 
        type: String, 
        required: false 
    },
    pincode: { 
        type: String, 
        required: false 
    },
    country: { 
        type: String, 
        required: true 
    },
    pan_no: { 
        type: String, 
        required: false 
    },
    gstin: { 
        type: String, 
        required: false 
    },
    tax_method: { 
        type: String, 
        required: false 
    },
    currency: { 
        type: String, 
        required: false 
    },
    storeLogo: { 
        type: String, 
        required: false 
    },
  },{ versionKey: false });
  
  companySchema.virtual('store_id').get(function(){
    return this._id.toString();
  })
  const Company = mongoose.model("store", companySchema);

  

  export default Company