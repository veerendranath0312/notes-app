const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)
mongoose
  .connect(url, { family: 4 })
  .then((result) => console.log('connected to mongodb'))
  .catch((error) =>
    console.log(`error connecting to mongodb: ${error.message}`)
  )

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    minLength: 5,
    required: true,
  },
  important: Boolean,
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

const Note = mongoose.model('Note', noteSchema)

module.exports = Note
