
export default async function login(req, res) {
    if (req.method !== 'POST') {
        res.status(405).send({ message: 'Only POST requests allowed' })
        return
    }
    let info = req.body;
    if(info.username && info.password){
        res.status(200).json(info)
    }
    res.status(404).json({ error: 'User Name | Password Missing' })

}