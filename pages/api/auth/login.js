import User from "@/utils/models/User";
import connect from "@/db"
import { createToken } from "@/utils/helper";

export default async function handler(req, res) {
    if (req.method === 'POST') {
        let info = req.body;
        if(info.username && info.password){
            try{
                await connect()
                let user = await User.findOne({username: info.username })
                if(user.verifyPasswordSync(info.password)){
                    user.token = createToken(user._id)
                    res.status(200).json(user)
                }
                res.status(404).json({ error: 'Wrong Password ' })
            } catch(err){
                res.status(500).json({ error:err, message: 'failed to Login' })
            }
        }
        res.status(404).json({ error: 'User Name | Password Missing' })
    }
}