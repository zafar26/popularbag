import { decodeToken, runMiddleware } from "@/utils/helper";
import Bag from "@/utils/models/Bag";
import connect from "@/db"
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
    if(req.method === "GET"){
        try{
            let userId = await decodeToken(req.headers.authorization)
            if(!userId ){ 
                res.status(404).json({ message: "Invalid Token"})
                return
            }
            await connect()

            const query =  { "title": { $regex: new RegExp(req.query.searchTitle, 'i') }, is_published:true };

            const bags = await Bag.find(query)

            res.status(200).json({ bags })
            return
        } catch(err){
            res.status(500).json({ err, message:"Failed to Search" })
            return
        }     
    }
}