
import mongoose from "../db/db.js";
const newSchema = new mongoose.Schema({
  
    name: { type: String, required:false },
    phoneno: { type: Number, required:false },
    active:{type: Boolean},
    timestamp: { type: Date, default: Date.now },
  
  },{ versionKey: false });
  
  newSchema.virtual('customer_id').get(function () {
    return this._id.toString();
  },{ versionKey: false });
  
  const customerModel  = mongoose.model("customer", newSchema);

export default customerModel