import mongoose from "mongoose";

const connect = async()=>{
    try {
        if(mongoose.connection.readyState != 1){
            await mongoose.connect (process.env.MONGO_URL);
        }
    } catch (errer) {
        console.log(error, "ERROR Conecting Mongo")
        throw new Error("Error in connecting to mongodb.");
    }
}

export default connect;