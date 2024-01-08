import Book from "@/utils/models/Book";
import connect from "@/db"
import { decodeToken } from "@/utils/helper";


export default async function handler(req, res) {
    if(req.method === "GET"){
        try{
            let userId = await decodeToken(req.headers.authorization)
            if(!userId ){ 
                res.status(404).json({ message: "Invalid Token"})
            }
            await connect()

            let page = 1;
            let limit = 10;
            if(req.query.page ){
                page = req.query.page
            }
            if(req.query.limit){
                limit = req.query.limit
            }

            let books = await Book.find({is_published: true}).skip((page-1) * limit).limit(limit)
            res.status(200).json({ books })
            
        }catch(err){
            res.status(500).json({ err, message:"Failed to get Books" })
                
        }
    }
}