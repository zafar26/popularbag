import mongoose from "mongoose";
import mongoBcrypt from 'mongoose-bcrypt';

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

userSchema.plugin(mongoBcrypt);

export default mongoose.models.User || mongoose.model("User", userSchema);