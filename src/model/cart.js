import mongoose from "../db/db.js";
const cartSchema = new mongoose.Schema({
 
   
    items: [
      {
          item_id: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'item',
              required: true
          },
          quantity: {
              type: Number,
              required: true,
              min: 1
          },
          price: {
              type: Number,
              required: true
          },
          total_price: {
              type: Number,
              required: true
          },
          discount: {
            type: Number,
            default: 0
        },
          cgst: {
              type: Number,
              default: 0
          },
          sgst: {
              type: Number,
              default: 0
          },
          igst: {
              type: Number,
              default: 0
          },
          cess: {
              type: Number,
              default: 0
          }
      }
  ],
  total_price: {
      type: Number,
      required: true,
      default: 0
  },
  total_discount:{
    type: Number,
      required: true,
      default: 0
  },
  total_cgst: {
      type: Number,
      default: 0
  },
  total_sgst: {
      type: Number,
      default: 0
  },
  total_igst: {
      type: Number,
      default: 0
  },
  total_cess: {
      type: Number,
      default: 0
  },
  total_tax_Amount: {
    type: Number,
    default: 0
  },
    timestamp: { type: Date, default: Date.now }
  },{ versionKey: false });
  
  cartSchema.virtual('cart_id').get(function () {
    return this._id.toString();
  });
  
  const Cart = mongoose.model("1cart", cartSchema);

export default Cart