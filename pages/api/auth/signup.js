import User from "@/utils/models/User";
import connect from "@/db"
import { createToken } from "@/utils/helper";

export default async function signup(req, res) {
    if (req.method !== 'POST') {
        res.status(405).send({ message: 'Only POST requests allowed' })
        return
    }
    let info = req.body;
    if(info.username && info.password){
        try{
            await connect()

            let new_user = new User(info)
            await new_user.save();
            
            let token = createToken(new_user._id)
            
            res.status(200).json({token, message:"Signedup Succesfull"})
        } catch(err){
            res.status(500).json({ error: err,
                message:'failed to Signup' })
        }
    }
    res.status(404).json({ error: 'User Name | Password Missing' })
}