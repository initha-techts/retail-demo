import mongoose from "mongoose";
const orderSchema = new mongoose.Schema({
    items: [{
        item_id: { type: mongoose.Schema.Types.ObjectId, ref: 'item', required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        total_price: { type: Number, required: true },
        cgst: { type: Number, default: 0 },
        sgst: { type: Number, default: 0 },
        igst: { type: Number, default: 0 },
        cess: { type: Number, default: 0 },
        total_tax_Amount: { type: Number, default: 0 },
        discount: { type: Number, default: 0 }
    }],
    total_amount: { type: Number, required: true },
    total_tax: { type: Number, required: true },
    payment_method: { type: String, required: true },
    status: { type: String, default: 'hold' },
    customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'customer', default: null },
    timestamp: { type: Date, default: Date.now }
}, { versionKey: false });

const Order = mongoose.model('order', orderSchema);
export default Order
