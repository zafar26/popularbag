import Book from "@/utils/models/Book";
import  connect from "@/db";
import { decodeToken } from "@/utils/helper";
import NextCors from 'nextjs-cors';


export default async function handler(req, res) {
    try{
        await NextCors(req, res, {
          // Options
          methods: [ 'POST' ],
          origin: '*',
          optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
       });
      } catch(er){
             res.status(400).json({message: "FAILED Running Middleare"})
             return 
      }
    if (req.method === 'POST') {
        try{
            let userId = await decodeToken(req.headers.authorization)
            if(!userId ){ 
                res.status(404).json({ message: "Invalid Token"})
            }
            await connect()
            let info = req.body;
            let new_book = new Book({
                title: info.title,
                description: info.description,
                author: info.author,
                created_by: userId
            })
            await new_book.save()
            res.status(200).json({ message: "Book Published"})
        }catch(err){
            res.status(500).json({ err, message: "Failed "})               
        }
    }
}