import { getSession } from 'next-auth/react';
import Razorpay from 'razorpay';
import Cors from 'cors'
import { runMiddleware } from '@/utils/helper';

const cors = Cors({
  methods: ['POST', 'GET', 'HEAD'],
})

export default async function handler(req, res) {
    try{
        await runMiddleware(req, res, cors)
    } catch(er){
           res.status(400).json({message: "FAILED Running Middleare"})
           return 
    }
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }

  // const session = await getSession({ req });

  // if (!session) {
  //   return res.status(401).end(); // Unauthorized
  // }

  const { amount, currency } = req.body; // You may customize this based on your requirements

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  const options = {
    amount: amount * 100, // Razorpay accepts amount in paise, so multiply by 100
    currency,
    receipt: `order_${Date.now()}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).end(); // Internal Server Error
  }
}
