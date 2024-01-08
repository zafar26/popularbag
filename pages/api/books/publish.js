import Book from "@/utils/models/Book";
import  connect from "@/db";
import { decodeToken } from "@/utils/helper";
import NextCors from 'nextjs-cors';

export const runtime = 'edge'

export default async function handler(req, res) {
    await NextCors(req, res, {
        // Options
        methods: [ 'POST' ],
        origin: '*',
        optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
     });
    if (req.method === 'POST') {
        try{
            let userId = decodeToken(req.headers.authorization)
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