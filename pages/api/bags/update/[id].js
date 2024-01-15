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
    const info = req.body
    if (req.method === 'PUT' && id) {
        try{
            let userId = await decodeToken(req.headers.authorization)
            if(!userId ){ 
                res.status(404).json({ message: "Invalid Token"})
                return
            }
            await connect()
            let data = { }
            if(info.title){
                data.title = info.title
            }
            if(info.description){
                data.description = info.description
            }
            if(info.price){
                data.price = info.price
            }
            if(info.stock){
                data.stock = info.stock
            }
            if(info.image){
                data.image = info.image
            }
            await Bag.updateOne({ _id: id }, { $set: data });
            res.status(200).json({ message: "Updated"})
            return
        } catch(err){
            res.status(500).json({ message: "failed to Update"}) 
            return
        }
    }
}