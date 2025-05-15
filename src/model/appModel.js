import mongoose from "../db/db.js";
const logoSchema = new mongoose.Schema(
  {
    admin_id:{
      type:String,
      required:false
    },
    org_id:{
      type:String,
      required:false
    },
    mainCategory_id: {
      type: String,
      ref:"Maincategory",
      required: true,
    },
    appLogo: {
      type: String,
      allownul: false,
    },
    app_category: {
        type: String,
        required: true,
      },
 
    timestamp: { type: Date, default: Date.now },
  },
  { versionKey: false }
);
logoSchema.virtual("app_id").get(function () {
  return this._id.toString();
});
const appModel = mongoose.model("apps", logoSchema);

export default appModel;
