import User from "@/utils/models/User";
import connect from "@/db"
import { createToken, runMiddleware } from "@/utils/helper";
import Cors from 'cors'

const cors = Cors({
  methods: ['POST', 'GET', 'HEAD'],
})

export default async function login(req, res) {
    try{
        await runMiddleware(req, res, cors)
    } catch(er){
           res.status(400).json({message: "FAILED Running Middleare"})
           return 
    }
    if (req.method !== 'POST') {
        res.status(405).send({ message: 'Only POST requests allowed' })
        return
    }
    let info = req.body;
    if(info.username && info.password){
        try{
            await connect()
            let user = await User.findOne({username: info.username })
            if(user.verifyPasswordSync(info.password)){
                let token = await createToken(user._id)
                res.status(200).json({token, message:"Loged In Succes"})
                return
            }
            res.status(404).json({ error: 'Wrong Password ' })
            return
        } catch(err){
            res.status(500).json({ error:err, message: 'failed to Login' })
            return
        }
    }
    res.status(404).json({ error: 'User Name | Password Missing' })
    return
}