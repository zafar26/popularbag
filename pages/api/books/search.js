import { decodeToken } from "@/utils/helper";
import Book from "@/utils/models/Book";
import connect from "@/db"


export default async function handler(req, res) {
    if(req.method === "GET"){
        try{
            let userId = decodeToken(req.headers.authorization)
            if(!userId ){ 
                res.status(404).json({ message: "Invalid Token"})
            }
            await connect()

            const query =  { "title": { $regex: new RegExp(req.query.searchTitle, 'i') } };

            const books = await Book.find(query)

            res.status(200).json({ books })
        } catch(err){
            res.status(500).json({ err, message:"Failed to Search" })
        }     
    }
}