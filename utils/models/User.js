import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema= new Schema({
    name: {
        type: String,
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true })

userSchema.plugin(require('mongoose-bcrypt'));

export default mongoose.models.User || mongoose.model("User", userSchema);