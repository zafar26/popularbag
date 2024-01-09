import Book from "@/utils/models/Book";
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
    if (req.method === 'PUT' && id) {
        try{
            let userId = await decodeToken(req.headers.authorization)
            if(!userId ){ 
                res.status(404).json({ message: "Invalid Token"})
                return
            }
            await connect()

            await Book.updateOne({ _id: id }, { $set: { is_published: false } });
            res.status(200).json({ message: "Book Unpublished"})
            return
        } catch(err){
            res.status(500).json({ message: "failed to Unpublished"}) 
            return
        }
    }
}