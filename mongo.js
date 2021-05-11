const mongoose = require('mongoose')

require('dotenv').config()

if (process.argv[2] !== 'add' && process.argv[2] !== 'list') {
  console.log(
    `${process.argv[2]} is not implemented.`,
    'Try node mongo.js add <name> <number> or node mongo.js list.',
  )
  process.exit(1)
}

const name = process.argv[3]
const number = process.argv[4]

const url = process.env.MONGODB_URI

mongoose.connect(url,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv[2] === 'list') {
  console.log('phonebook:')
  Person.find({}).then((result) => {
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
} else {
  if (process.argv.length !== 5 ||
    process.argv[3].length < 6 ||
    process.argv[4].length < 6) {
    console.log('Usage: <name> <number> \n example: "Jaakko Peltola" 044592923')
    process.exit(1)
  }

  const person = new Person({ name, number })

  person.save().then(() => {
    console.log(`person ${name} ${number} saved!`)
    mongoose.connection.close()
  })
}
