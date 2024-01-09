import connect from "@/db"
import { decodeToken, runMiddleware } from "@/utils/helper"
import Book from "@/utils/models/Book"
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
            }
            await connect()
            
            let books = await Book.find({created_by: userId})
            res.status(200).json({ books })
        
        } catch(err){
            res.status(500).json({ message: "Failed to Get"})
        }
    }
}