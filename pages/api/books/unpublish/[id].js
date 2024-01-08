import Book from "@/utils/models/Book";
import connect from "@/db"
import { decodeToken } from "@/utils/helper";
import NextCors from 'nextjs-cors';


export default async function handler(req, res) {
    const { id } = req.query;
    await NextCors(req, res, {
        // Options
        methods: [ 'PUT' ],
        origin: '*',
        optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
     });
    if (req.method === 'PUT' && id) {
        try{
            let userId = decodeToken(req.headers.authorization)
            if(!userId ){ 
                res.status(404).json({ message: "Invalid Token"})
            }
            await connect()

            await Book.updateOne({ _id: id }, { $set: { is_published: false } });
            res.status(200).json({ message: "Book Unpublished"})
        } catch(err){
            res.status(500).json({ message: "failed to Unpublished"})  
        }
    }
}