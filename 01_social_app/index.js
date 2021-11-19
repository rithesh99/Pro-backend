const express = require('express')
var format = require('date-format');
const app = express()
const PORT = process.env.PORT || 3000 

app.get('/', (req, res) => {
  res.status(201).send('Hello World!')
})

app.get('/api/v1/instagram', (req, res) => {
  const instaSocial = {
    username: "rithesh__rithu__22",
    followers: 512,
    follows: 339,
    date: format.asString('dd/MM - hh:mm:ss', new Date())
  }
  res.status(200).json(instaSocial)
})

app.get('/api/v1/facebook', (req, res) => {
  const instaSocial = {
    username: "rithesh__FB",
    followers: 355,
    follows: 233,
    date: format.asString('dd/MM - hh:mm:ss', new Date())
  }
  res.status(200).json(instaSocial)
})

app.get('/api/v1/linkedin', (req, res) => {
  const instaSocial = {
    username: "Rithesh D",
    followers: 179,
    follows: 203,
    date: format.asString('dd/MM - hh:mm:ss', new Date())
  }
  res.status(200).json(instaSocial)
})

app.get('/api/v1/:token', (req, res) => {
  res.status(200).json({ param: req.params.token })
})

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`)
})