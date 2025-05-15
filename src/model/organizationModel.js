import mongoose from "../db/db.js";
const orgSchema = new mongoose.Schema({


    category_id: {
        type: String,
        ref: "Maincategory",
        required: true,
    },
    admin_id: {
        type: String,
        ref: "register",
        required: false,
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
}, {
    versionKey: false
});
orgSchema.virtual("org_id").get(function () {
    return this._id.toString();
});
const organizationModel = mongoose.model("organization", orgSchema);

export default organizationModel;