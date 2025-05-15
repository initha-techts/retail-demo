import mongoose from "../db/db.js";
const brandSchema = new mongoose.Schema(
  {
    org_id: {
      type: String,
      required: false,
    },
    admin_id: {
      type: String,
      required: false,
    },
    company_id: {
      type: String,
      required: true,
    },
    brandName: {
      type: String,
      required: true,
    },
    brandCode: {
      type: String,
      required: true,
      unique: true,
    },
    brandLogo: {
      type: String,
      required: false
    },
    timestamp: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

brandSchema.virtual("brand_id").get(function () {
  return this._id.toString();
});

const Brand = mongoose.model("Brand", brandSchema);

export default Brand;
