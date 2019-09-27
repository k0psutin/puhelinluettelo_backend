const mongoose = require('mongoose')

if ( process.argv.length < 3 ) {
    console.log(`give password as argument`)
    process.exit(1)
}

const password = process.argv[2]
const newName = process.argv[3]
const newNumber = process.argv[4]

const url =
   `mongodb+srv://fullstack_kurssi:${password}@cluster0-pazov.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

    const person = new Person({
       name: newName,
       number: newNumber
    })

if(newName != null && newNumber != null) {
    person.save().then(response => {
        console.log(`added ${newName} number ${newNumber} to phonebook`)
        mongoose.connection.close()
    })
} else {
    console.log(`phonebook:`)
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
}

  
