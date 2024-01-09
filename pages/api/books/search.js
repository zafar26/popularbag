import { decodeToken, runMiddleware } from "@/utils/helper";
import Book from "@/utils/models/Book";
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

            const query =  { "title": { $regex: new RegExp(req.query.searchTitle, 'i') } };

            const books = await Book.find(query)

            res.status(200).json({ books })
            return
        } catch(err){
            res.status(500).json({ err, message:"Failed to Search" })
            return
        }     
    }
}