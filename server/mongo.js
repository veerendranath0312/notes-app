const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)

mongoose.connect(url, { family: 4 })

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

// creating the notes
// const note = new Note({
//   content: 'HTML is easy',
//   important: true,
// })

// note.save().then((result) => {
//   console.log('note saved!')
//   mongoose.connection.close()
// })

// fetching the notes
Note.find({}).then((result) => {
  result.forEach((note) => {
    console.log(note)
  })

  mongoose.connection.close()
})
