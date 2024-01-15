import Bag from "@/utils/models/Bag";
import  connect from "@/db";
import { decodeToken, runMiddleware } from "@/utils/helper";
import Cors from 'cors'

const cors = Cors({
  methods: ['POST', 'GET', 'HEAD'],
})

export default async function handler(req, res) {
    try{
        await runMiddleware(req, res, cors)
    } catch(er){
           res.status(400).json({message: "FAILED Running Middleare"})
           return 
    }
    if (req.method === 'POST') {
        try{
            let userId = await decodeToken(req.headers.authorization)
            if(!userId ){ 
                res.status(404).json({ message: "Invalid Token"})
                return
            }
            await connect()
            let info = req.body;
            let new_bag = new Bag({
                title: info.title,
                description: info.description,
                price: info.price,
                image: info.image,
            })
            await new_bag.save()
            res.status(200).json({ message: "Bag Published"})
            return
        }catch(err){
            res.status(500).json({ err, message: "Failed "}) 
            return
        }
    }
}