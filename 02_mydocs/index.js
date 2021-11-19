const express = require('express')
const app = express()

const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

const fileUpload = require('express-fileupload')

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json());
app.use(fileUpload());

let courses = [
    {
        id: "11",
        name: "Learn React JS",
        price: 299
    },
    {
        id: "22",
        name: "Angular Course",
        price: 399
    },
    {
        id: "33",
        name: "Full stack Django developer",
        price: 899
    }
]

app.get("/", (req, res) => {
    res.send("hello from new app")
})

app.get("/api/v1/test", (req, res) => {
    res.send("Test route")
})

app.get("/api/v1/object", (req, res) => {
    res.send({ "id": "1", "name": "Course name", "price": 999 })
})

app.get("/api/v1/courses", (req, res) => {
    res.send(courses)
})

app.get("/api/v1/courses/:id", (req, res) => {
    var course = courses.find(c => c.id === req.params.id)
    res.send(course)
})

app.post("/api/v1/courses/add", (req, res) => {
    courses.push(req.body)
    res.send(courses)
})


app.get("/api/v1/coursesquery", (req, res) => {
    let location = req.query.location
    let device = req.query.device
    console.log(req.query);
    res.send({location: location, device: device})
})


app.post("/api/v1/imageupload", (req, res) => {
    console.log(req.headers);
    let file = req.files.image
    let path = __dirname + "/images/" + Date.now() + ".jpg"
    file.mv(path, (err) => {
        res.send(true)
    })
})



app.listen(3000, () => {
    console.log('Server is running at 3000...')
})