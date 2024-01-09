import User from "@/utils/models/User";
import connect from "@/db"
import { createToken, runMiddleware } from "@/utils/helper";
import Cors from 'cors'

const cors = Cors({
  methods: ['POST', 'GET', 'HEAD'],
})

export default async function signup(req, res) {
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

            let new_user = new User(info)
            await new_user.save();
            
            let token = await createToken(new_user._id)
            
            res.status(200).json({token, message:"Signedup Succesfull"})
            return
        } catch(err){
            res.status(500).json({ error: err,
                message:'failed to Signup' })
            return
        }
    }
    res.status(404).json({ error: 'User Name | Password Missing' })
    return
}