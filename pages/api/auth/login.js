import User from "@/utils/models/User";
import connect from "@/db"
import { createToken } from "@/utils/helper";
import NextCors from 'nextjs-cors';


export default async function login(req, res) {
    await NextCors(req, res, {
        // Options
        methods: [ 'POST' ],
        origin: '*',
        optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
     });
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
                let token = createToken(user._id)
                res.status(200).json({token, message:"Loged In Succes"})
            }
            res.status(404).json({ error: 'Wrong Password ' })
        } catch(err){
            res.status(500).json({ error:err, message: 'failed to Login' })
        }
    }
    res.status(404).json({ error: 'User Name | Password Missing' })

}