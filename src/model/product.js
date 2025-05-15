
import mongoose from "../db/db.js";
const newSchema = new mongoose.Schema({
    org_id:{ type: String, required:false }, 
    admin_id:{ type: String, required:false }, 
    store_id:{type: String, required:false },
    category: { type: String, required:false},
    brand: { type: String, required:false },
    prod_code: { type: String, required:false },
    barcode: { type: String, required:false },
    prod_name: { type: String, required:false },
    uom: { type: String, required:false },
    total_stock: { type: Number, required:false },
    low_stock: { type: Number, required:false},
    expiry_alert: { type: String, required:false },
    purchase_price: { type: Number, required:false },
    sale_price: { type: Number, required:false },
    MRP: { type: Number, required:false },
    cgst:{ type: Number, required:false},
    sgst:{ type: Number, required:false },
    igst: { type: Number, required:false },
    discount: { type: Number, required:false },
    prod_image: { type: String, required:false },
    active:{type: Boolean},
    timestamp: { type: Date, default: Date.now },
  
  },{ versionKey: false });
  
  newSchema.virtual('prod_id').get(function () {
    return this._id.toString();
  });
  
  const productModel  = mongoose.model("product", newSchema);

export default productModel