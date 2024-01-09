import { decodeToken } from "@/utils/helper";
import Book from "@/utils/models/Book";
import connect from "@/db"
import NextCors from "nextjs-cors";


export default async function handler(req, res) {
    try{
        await NextCors(req, res, {
          // Options
          methods: [ 'GET' ],
          origin: '*',
          optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
       });
      } catch(er){
             res.status(400).json({message: "FAILED Running Middleare"})
             return 
      }
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