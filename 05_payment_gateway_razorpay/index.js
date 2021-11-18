require('dotenv').config()
const express = require('express');
const app = express();

const Razorpay = require('razorpay')

app.use(express.json())

app.get('/', (req, res) => {
    res.send("working")
})

app.post('/order', async (req, res) => {
    const amount = req.body.amount;
    console.log("Amount", amount)
    var instance = new Razorpay({
        key_id: process.env.KEY_ID,
        key_secret: process.env.KEY_SECRET
    })
    var options = {
        amount: amount * 100,
        currency: "INR",
        receipt: "receipt#1"
    }
    const myOrder = await instance.orders.create(options)
    // return res.send(myOrder);
    return res.json({
        "success": true,
        "amount": amount,
        myOrder
    });
})

app.listen(3000, () => {
    console.log('Server is running...')
})



