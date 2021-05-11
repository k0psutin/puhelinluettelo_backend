const express = require('express')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

app.use(express.json())
app.use(express.static('build'))

app.use(cors())

var morgan = require('morgan')

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

require('dotenv').config()

app.get('/api/persons', (req, res, next) => {
    Person.find({}).then(person => {
        person ? res.json(person) : res.status(404).end()
    }).catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
    const body = req.body

    const person = new Person({ ...body })

    person.save().then(savedPerson => {
        res.json(savedPerson)
    }).catch(error => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id).then(person => {
        person ? res.json(person) : res.status(404).end()
    }).catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id).then(() => {
        res.status(204).end()
    }).catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body

    const person = { ...body }

    Person.findByIdAndUpdate(req.params.id, person, { new: true })
        .then(updatedPerson => {
            res.json(updatedPerson)
        }).catch(error => next(error))
})

app.get('/info', (req, res, next) => {
    Person.find({}).then(persons => {
        res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${Date()}</p>`)
    }).catch(error => next(error))
    
})

const unkownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unkown endpoint' })
}

app.use(unkownEndpoint)

const errorHandler = (error, req, res, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return res.status(400).send({ error: 'malformatted id' })
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message})
    }
  
    next(error)
  }

app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})