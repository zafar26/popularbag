import mongoose from "mongoose";

const { Schema } = mongoose;

const bookSchema= new Schema({
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    author: {
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

export default mongoose.models.Book || mongoose.model("Book", bookSchema);