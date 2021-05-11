const express = require('express')
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(express.static('build'))

app.use(cors())

var morgan = require('morgan')

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

require('dotenv').config()

let persons = [
    {
        name: 'Arto Hellas',
        number: '040-123456',
        id: 1
    },
    {
        name: 'Ada Lovelace',
        number: '39-44-5323523',
        id: 2
    },
    {
        name: 'Dan Abramov',
        number: '12-43-1235423',
        id: 3
    },
    {
        name: 'Mary Poppendieck',
        number: '39-23-53453453',
        id: 4
    }
]

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.post('/api/persons', (req, res) => {
    
    const id = Math.floor(Math.random() * 99999)
    const person = req.body

    if (!person.name || !person.number) {
        return res.status(400).json({ error: 'content missing' })
    }

    if (person.name.length < 6 || person.number.length < 6) {
        const msg = person.name.length < 6 ? 'name is too short (<6 chars)' : 'number is too short (<6 chars)'
        return res.status(400).json({ error: msg })
    }

    if (persons.find(obj => obj.name.toLowerCase() === person.name.toLowerCase())) {
        return res.status(400).json({ error: 'name must be unique' })
    }

    person.id = id
    persons = persons.concat(person)
    res.json(person)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)

    if (!person) {
        res.status(404).end()
    }

    res.json(person)
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)

    res.status(204).end()
})

app.get('/info', (req, res) => {
    res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${Date()}</p>`)
})

const unkownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unkown endpoint' })
}

app.use(unkownEndpoint)

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})