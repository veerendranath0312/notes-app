import { useState, useEffect } from 'react'

import Note from './components/Note'
import Notification from './components/Notification'
import Footer from './components/Footer'

import noteService from './services/notes'

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    const getNotes = async () => {
      const data = await noteService.getAll('http://localhost:3001/notes')

      setNotes(data)
    }

    getNotes()
  }, [])

  const addNote = async (event) => {
    event.preventDefault()

    const noteObj = {
      content: newNote,
      important: Math.random() < 0.5,
    }

    const data = await noteService.create(noteObj)

    setNotes((prevNotes) => [...prevNotes, data])
    setNewNote('')
  }

  const toggleImportanceOf = async (id) => {
    const note = notes.find((note) => note.id === id)
    const changedNote = { ...note, important: !note.important }

    try {
      const data = await noteService.update(id, changedNote)

      setNotes((prevNotes) =>
        prevNotes.map((note) => (note.id === id ? data : note))
      )
    } catch (error) {
      console.log(`💥 Error: ${error.message}`)
      setErrorMessage(
        `the note '${note.content}' was already deleted from server`
      )
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)

      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id))
    }
  }

  const notesToShow = showAll ? notes : notes.filter((note) => note.important)

  return (
    <div>
      <h1>Notes</h1>

      <Notification message={errorMessage} />

      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>

      <br />

      <form onSubmit={addNote}>
        <input value={newNote} onChange={(e) => setNewNote(e.target.value)} />
        <button type="submit">save</button>
      </form>

      <ul>
        {notesToShow.map((note) => (
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        ))}
      </ul>

      <Footer />
    </div>
  )
}

export default App
