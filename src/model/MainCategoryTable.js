import mongoose from "../db/db.js";
const mainCategorySchema = new mongoose.Schema(
  {
    admin_id:{
      type:String,
      require:false
    },
    org_id:{
      type:String,
      require:false
    },
    categoryName: {
      type: String,
      required: true,
    },
    price: {
        type: Number,
        required: true,
      },
 
    timestamp: { type: Date, default: Date.now },
  },
  { versionKey: false }
);
mainCategorySchema.virtual("mainCategory_id").get(function () {
  return this._id.toString();
});
const MaincategoryModel = mongoose.model("Maincategory", mainCategorySchema);

export default MaincategoryModel;
