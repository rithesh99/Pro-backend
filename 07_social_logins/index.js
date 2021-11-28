const express = require('express');
const app = express();

app.get("/", (req, res) => {
    return res.json({
        success: true,
        message: "home route"
    })
})


app.listen(3000, () => {
    console.log('Server is running...')
})