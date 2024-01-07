import connect from "@/db"
import { decodeToken } from "@/utils/helper"
import Book from "@/utils/models/Book"

export default async function handler(req, res) {
    if(req.method === "GET"){    
        try{
            let userId = decodeToken(req.headers.authorization)
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