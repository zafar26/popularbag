import mongoose from "mongoose";

const { Schema } = mongoose;

const bookSchema= new Schema({
    name: {
        type: String,
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
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

export default mongoose.models.Book || mongoose.model("Book", bookSchema);