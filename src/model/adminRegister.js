import mongoose from "../db/db.js";
const registerSchema = new mongoose.Schema({


  category_id:{
    type:String,
    required: true,
  },
  org_id:{
    type:String,
    required: true,
  },
  userName: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: false,
  },
  applogo_id: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
}, {
  versionKey: false
});
registerSchema.virtual("admin_id").get(function () {
  return this._id.toString();
});
const adminRegisterModel = mongoose.model("admin", registerSchema);

export default adminRegisterModel;