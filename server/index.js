const express = require('express')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 3001

// middleware
app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

let notes = [
  {
    id: '1',
    content: 'HTML is easy',
    important: true,
  },
  {
    id: '2',
    content: 'Browser can execute only JavaScript',
    important: false,
  },
  {
    id: '3',
    content: 'GET and POST are the most important methods of HTTP protocol',
    important: true,
  },
]

app.get('/', (req, res) => {
  res.status(200).send('<h1>hello world!</h1>')
})

app.get('/api/notes', (req, res) => {
  res.status(200).json(notes)
})

app.post('/api/notes', (req, res) => {
  const body = req.body

  if (!body.content) {
    return res.status(400).json({
      error: 'content missing',
    })
  }

  const note = {
    content: body.content,
    important: body.important || false,
    id: crypto.randomUUID(),
  }

  notes = [...notes, note]

  res.status(201).json(note)
})

app.get('/api/notes/:id', (req, res) => {
  const { id } = req.params
  const note = notes.find((note) => note.id === id)

  if (note) {
    res.status(200).json(note)
  } else {
    res.status(404).json({ message: `note not found` })
  }
})

app.delete('/api/notes/:id', (req, res) => {
  const { id } = req.params

  notes = notes.filter((note) => note.id !== id)
  res.status(204).end()
})

const unknownEndpoint = (req, res) => {
  res.status(404).json({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}...`)
})
