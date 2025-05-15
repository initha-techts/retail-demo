import mongoose from "../db/db.js";
const otherSchema = new mongoose.Schema({



    timestamp: {
        type: Date,
        default: Date.now
    },
}, {
    versionKey: false
});
otherSchema.virtual("other_id").get(function () {
    return this._id.toString();
});
const other = mongoose.model("other", otherSchema);

export default other;
