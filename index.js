require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const Person = require('./modules/person')

const stringFormat = ':method :url :status :req[content-length] :response-time ms - :post'

app.use(express.static('build'))
app.use(bodyParser.json())
app.use(morgan(stringFormat))
app.use(cors())

morgan.token('post', function (req, res) {
   if(req.body.name != undefined | req.body.number != undefined) {
    return JSON.stringify({ name: req.body.name,number: req.body.number })
   }
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
        if (person) {
        response.json(person.toJSON())
        } else {
            response.status(404).end()
        }
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number,
    }

    Person.findByIdAndUpdate(request.params.id, person, { new:true })
        .then(updatedPerson => {
            response.json(updatedPerson.toJSON())
        })
         .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const newPerson = request.body

    const person = new Person({
        name: newPerson.name,
        number: newPerson.number,
    })

    person.save().then(savedPerson => savedPerson.toJSON())
    .then(savedAndFormattedPerson => {
        response.json(savedAndFormattedPerson)
    })
    .catch(error => next(error))
})

app.get('/api/persons/', (request, response, next) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
    .catch(error => next(error))
})

app.get('/api/info/', (request, response) => {
    const currentDate = new Date()
    const message = `<p>Phonebook has info for ${Person.length} people<p><br>${currentDate}`

    response.send(message)
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(person => {
            response.status(204).end()
        })
         .catch(error => next(error))
})

const unkownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unkownEndpoint)

const errorHandler = (error, request, response, next) => {

    if (error.name === 'CastError' && error.kind === 'ObjectId') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') { 
        return response.status(400).json({ error: error.message })
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
