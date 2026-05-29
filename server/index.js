require('dotenv').config()
const express = require('express')
const cors = require('cors')
const Note = require('./models/note.js')

const app = express()
const PORT = process.env.PORT || 3001

// middleware
app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

// let notes = [
//   {
//     id: '1',
//     content: 'HTML is easy',
//     important: true,
//   },
//   {
//     id: '2',
//     content: 'Browser can execute only JavaScript',
//     important: false,
//   },
//   {
//     id: '3',
//     content: 'GET and POST are the most important methods of HTTP protocol',
//     important: true,
//   },
// ]

app.get('/', (req, res) => {
  res.status(200).send('<h1>hello world!</h1>')
})

app.get('/api/notes', (req, res) => {
  Note.find({}).then((notes) => {
    res.status(200).json(notes)
  })
})

app.post('/api/notes', (req, res) => {
  const body = req.body

  if (!body.content) {
    return res.status(400).json({
      error: 'content missing',
    })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save().then((savedNote) => {
    res.status(201).json(savedNote)
  })
})

app.get('/api/notes/:id', (req, res, next) => {
  const { id } = req.params

  Note.findById(id)
    .then((note) => {
      if (note) {
        res.status(200).json(note)
      } else {
        res.status(404).end()
      }
    })
    .catch((error) => next(error))
})

app.put('/api/notes/:id', (req, res, next) => {
  const { id } = req.params
  const { content, important } = req.body

  Note.findById(id).then((note) => {
    if (!note) {
      return res.status(404).end()
    }

    note.content = content
    note.important = important

    return note
      .save()
      .then((updatedNote) => {
        res.status(200).json(updatedNote)
      })
      .catch((error) => next(error))
  })
})

app.delete('/api/notes/:id', (req, res, next) => {
  const { id } = req.params

  Note.findByIdAndDelete(id)
    .then((result) => res.status(204).end())
    .catch((error) => next(error))
})

const unknownEndpoint = (req, res) => {
  res.status(404).json({ error: 'unknown endpoint' })
}

const errorHandler = (error, req, res, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return res.status(400).json({ error: 'malformatted id' })
  }

  next(error)
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

// this should be the last loaded middleware
// also all the routes should be registered before this!
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}...`)
})
