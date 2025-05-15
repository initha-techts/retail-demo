import mongoose from "mongoose";
const cartSchema = new mongoose.Schema({
    item_id: { type: mongoose.Schema.Types.ObjectId, ref: 'item', required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
    total_price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    cgst: { type: Number, default: 0 },
    sgst: { type: Number, default: 0 },
    igst: { type: Number, default: 0 },
    cess: { type: Number, default: 0 },
    total_tax_Amount: { type: Number, default: 0 },
    timestamp: { type: Date, default: Date.now }
}, { versionKey: false });

cartSchema.virtual('dCart_id').get(function(){
    return this._id.toString()
})

const demoCart = mongoose.model('democart', cartSchema);

export default demoCart