require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const Person = require('./modules/person')

const stringFormat = ':method :url :status :req[content-length] :response-time ms - :post'

app.use(bodyParser.json())
app.use(morgan(stringFormat))
app.use(cors())
app.use(express.static('build'))

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

morgan.token('post', function (req, res) {
   if(req.body.name != undefined | req.body.number != undefined) {
    return JSON.stringify({ name: req.body.name,number: req.body.number })
   }
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person.toJSON())
    })
})

app.post('/api/persons', (request, response) => {
    const newPerson = request.body

        if (newPerson.name === undefined | 
            newPerson.number === undefined) {
            return response.status(400).json({
                error: `name or number missing`
            })
        }

    const person = new Person({
        name: newPerson.name,
        number: newPerson.number,
    })

    //console.log('newPerson', person.id)

    person.save().then(savedPerson => {
        response.json(savedPerson.toJSON())
    })
})

app.get('/api/persons/', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/api/info/', (request, response) => {
    const currentDate = new Date()
    const message = `<p>Phonebook has info for ${persons.length} people<p><br>${currentDate}`

    response.send(message)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    //console.log(persons)
    //console.log(id)
    response.status(204).end()
})