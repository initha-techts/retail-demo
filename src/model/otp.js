import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    otp: { type: String, required: true },
    otpExpires: { type: Date, required: true },
    verified: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now },
  },{ versionKey: false });
  

const Otps = mongoose.model('otps', otpSchema);

export default Otps

