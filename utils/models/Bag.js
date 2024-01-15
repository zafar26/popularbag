import mongoose from "mongoose";

const { Schema } = mongoose;

const bagSchema= new Schema({
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
    },
    stock: {
        type: Number,
    },
    image: {
        type: String,
    },
    is_published: {
        type: Boolean,
        default: true
    },
    created_by: {
        type: String,
        default: "admin"
    },
}, { timestamps: true })

export default mongoose.models.Bag || mongoose.model("Bag", bagSchema);