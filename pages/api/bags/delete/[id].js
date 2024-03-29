import Bag from "@/utils/models/Bag";
import connect from "@/db"
import { decodeToken, runMiddleware } from "@/utils/helper";
import Cors from 'cors'

const cors = Cors({
  methods: ['PUT', 'GET', 'HEAD'],
})

export default async function handler(req, res) {
    try{
        await runMiddleware(req, res, cors)
    } catch(er){
           res.status(400).json({message: "FAILED Running Middleare"})
           return 
    }
    const { id } = req.query;
    if (req.method === 'DELETE' && id) {
        try{
            let userId = await decodeToken(req.headers.authorization)
            if(!userId ){ 
                res.status(404).json({ message: "Invalid Token"})
                return
            }
            await connect()

            await Bag.deleteOne({ _id: id });
            res.status(200).json({ message: "Bag Deleted"})
            return
        } catch(err){
            res.status(500).json({ message: "failed to Delete"}) 
            return
        }
    }
}