import mongoose from "../db/db.js";
const newSchema = new mongoose.Schema({

    title:{
        type: String,
        required: false
    },
    Hline1 : {
        type: String,
        required: false
    },
    Hline2 : {
        type: String,
        required: false
    },
    Hline3 : {
        type: String,
        required: false
    },
    Hline4 : {
        type: String,
        required: false
    },
    Hline5 : {
        type: String,
        required: false
    },
    Fline1 : {
        type: String,
        required: false
    },
    Fline2 : {
        type: String,
        rrequired: false
    },
    Fline3 : {
        type: String,
        required: false
    },
    Fline4 : {
        type: String,
        required: false
    },
    Fline5 : {
        type: String,
        required: false
    },
    text : {
        type: String,
        required: false
    },
    timestamp: { type: Date, default: Date.now },
  
  });
  
  newSchema.virtual('HF_id').get(function () {
    return this._id.toString();
  },{ versionKey: false });
  
  const Headerfooter = mongoose.model("headerFooter", newSchema);

export default Headerfooter