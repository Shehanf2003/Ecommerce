import mongoose, { disconnect } from "mongoose";

const cartSchema = new mongoose.Schema({
   code: {
    type: String,
    required: true,
    unique: true,   
   }, 
   disconnectPercentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
   },
   expirationDate: {
    type: Date,
    required: true,
   },
   isActive: {
    type: Boolean,
    default: true,
   },
   userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
   },
},
{
    timestamps: true,

});

export const Coupon = mongoose.model("Coupon", cartSchema);

export default Coupon;