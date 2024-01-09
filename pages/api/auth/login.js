import User from "@/utils/models/User";
import connect from "@/db"
import { createToken } from "@/utils/helper";
// import NextCors from 'nextjs-cors';
import Cors from 'cors'

// Initializing the cors middleware
// You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
const cors = Cors({
  methods: ['POST', 'GET', 'HEAD'],
})
export const config = {
    api: {
      externalResolver: true,
    },
  }
// export async function OPTIONS(request) {
//     const allowedOrigin = request.headers.get("origin");
//     const response = new response(null, {
//       status: 200,
//       headers: {
//         "Access-Control-Allow-Origin": allowedOrigin || "*",
//         "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
//         "Access-Control-Allow-Headers":
//           "Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version",
//         "Access-Control-Max-Age": "86400",
//       },
//     });
  
//     return response;
// }

// Initializing the cors middleware
// You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
// const cors = Cors({
//     methods: ['POST', 'GET', 'HEAD'],
//   })
  
  // Helper method to wait for a middleware to execute before continuing
  // And to throw an error when an error happens in a middleware
  function runMiddleware(
    req,
    res,
    fn
  ) {
    return new Promise((resolve, reject) => {
        console.log("Before Promise")
      fn(req, res, (result) => {
        console.log("Before Cond")

        if (result instanceof Error) {
        console.log("Cond")

          return reject(result)
        }
        console.log("Before Return")
        
        return resolve(result)
      })
      console.log("After Promise")

    })
  }

export default async function login(req, res) {
    try{
        console.log("Before CORS")
        // let cors = await NextCors(req, res, {
        //     // Options
        //     methods: [ 'POST' ],
        //     origin: '*',
        //     optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
        // });
        console.log("Before Middleware")

        // Run the middleware
        await runMiddleware(req, res, cors)
        console.log("After Middleware")

    } catch(er){
           res.status(400).json({message: "FAILED BEFORE"}) 
    }
    if (req.method !== 'POST') {
        res.status(405).send({ message: 'Only POST requests allowed' })
        return
    }
    let info = req.body;
    if(info.username && info.password){
        try{
            await connect()
            let user = await User.findOne({username: info.username })
            if(user.verifyPasswordSync(info.password)){
                let token = await createToken(user._id)
                res.status(200).json({token, message:"Loged In Succes"})
            }
            res.status(404).json({ error: 'Wrong Password ' })
        } catch(err){
            res.status(500).json({ error:err, message: 'failed to Login' })
        }
    }
    res.status(404).json({ error: 'User Name | Password Missing' })

}