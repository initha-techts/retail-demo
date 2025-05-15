import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  product: { type: String, required: false },
  quantity: { type: Number, required: false },
  uom: { type: String },
  discount: { type: Number, default: 0 },
  salePrice: { type: Number, required: false },
  amount: { type: Number, required: false },
  cgst: { type: Number, default: 0 },
  sgst: { type: Number, default: 0 },
}, { _id: false });

const invoiceSchema = new mongoose.Schema({
  invoiceType: { type: String, default: 'Sale' },
  invoiceNo: { type: String, required: false, unique: true },
  date: { type: Date, default: Date.now },
  soldBy: { type: String, required: false },
  customerName: { type: String, required: false },
  mobileNo: { type: String, required: false },
  products: [productSchema],
  totalQty: { type: Number, required: false },
  discountAmount: { type: Number, default: 0 },
  roundOff: { type: Number, default: 0 },
  cgstAmount: { type: Number, default: 0 },
  sgstAmount: { type: Number, default: 0 },
  totalTaxableValue: { type: Number, required: false },
  totalAmount: { type: Number, required: false },
  paymentMethod: { type: String, required: false },
  loyaltyPointsUsed: { type: Number, default: 0 },
  
}, {
  timestamps: true 
});

const Invoice = mongoose.model('Invoice', invoiceSchema);
export default Invoice;
