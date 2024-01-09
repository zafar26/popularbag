import jwt from 'jsonwebtoken'


export async function decodeToken(auth){
    let token = auth.split(" ")[1]
    var decoded = await jwt.verify(token, process.env.JWT_SECRET);
    if(!decoded){
        return false
    }
    return decoded.userId
}

export async function createToken(userId){
    let token = "Bearer " + await jwt.sign({ userId }, process.env.JWT_SECRET)
    return token
}

export async function runMiddleware(req, res, fn) {
    return new Promise((resolve, reject) => {
      fn(req, res, (result) => {
        if (result instanceof Error) {
          return reject(result)
        }        
        return resolve(result)
      })
    })
  }