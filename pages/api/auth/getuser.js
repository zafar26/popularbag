import User from "@/utils/models/User";
import connect from "@/db"
import { runMiddleware } from "@/utils/helper";
import Cors from 'cors'

const cors = Cors({
  methods: ['POST', 'GET', 'HEAD'],
})

export default async function getUser(req, res) {
    try{
        await runMiddleware(req, res, cors)
    } catch(err){
        res.status(400).json({err, message: "FAILED Running Middleare"})
        return 
    }
    if (req.method !== 'POST') {
        res.status(405).send({ message: 'Only POST requests allowed' })
        return
    }
    let info = req.body;
    if(info.username ){
        try{
            await connect()
            let user = await User.findOne({username: info.username })
            if(user.username){
                res.status(200).json({ found:true, message:"User Found"})
                return
            }
            res.status(404).json({ found:false, message:"User Not Found"})
            return
        } catch(err){
            res.status(500).json({ err, message: 'failed to Get user' })
            return
        }
    }
    res.status(404).json({ error: 'User Name Missing' })
    return
}