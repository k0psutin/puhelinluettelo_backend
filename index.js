const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')

const stringFormat = ':method :url :status :req[content-length] :response-time ms - :post'

app.use(bodyParser.json())
app.use(morgan(stringFormat))
app.use(cors())
app.use(express.static('build'))

let persons = [
    {
        name: "Ada Lovelace", 
        number: "040-696969",
        id: 1
    },
    {
        name: "Arto Hellas", 
        number: "040-123456",
        id: 2
    },
    {
        name: "Abraham DeGrell", 
        number: "040-904949",
        id: 3
    },
    {
        name: "Mary Poppendieck", 
        number: "09-9837372",
        id: 4
    },
    {
        name: "Spede Pasanen", 
        number: "044-383838",
        id: 5
    }
]

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

morgan.token('post', function (req, res) {
   if(req.body.name | req.body.number) {
    return JSON.stringify({ name: req.body.name,number: req.body.number })
   }
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(n => n.id == id)
    if(person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
    
})

const generateNumber = () => Math.floor(Math.random() * 99999) + 500

app.post('/api/persons', (request, response) => {
    const newPerson = request.body

    checkPerson = persons.find(person => person.name == newPerson.name)

    if(checkPerson) {
        if (checkPerson.name === newPerson.name) {
            return response.status(400).json({
                error: `person with that name already exists`
            })
        }
    }

    if (!newPerson.name | !newPerson.number) {
        return response.status(400).json({ 
          error: 'name or number missing' 
        })
      }

    const person = {
        name: newPerson.name,
        number: newPerson.number,
        id: generateNumber(),
    }

    //console.log('newPerson', person.id)

    persons = persons.concat(person)

    response.json(persons)
})

app.get('/api/persons/', (request, response) => {
    response.json(persons)
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