import { ChangeEvent, useState } from 'react'
import { NewNoteCard } from './components/new-note-card.tsx'
import { NoteCard } from './components/note-card.tsx'
import React from 'react'

interface Note{
  id: string,
  date: Date,
  content: string,
  isWritten: boolean
}

function App() {

  const [search, setSearch] = useState('')
  const [notes, setNotes] = useState<Note[]>(
    () => {
      const noteOnStorage = localStorage.getItem('notes')

      if(noteOnStorage){
        return JSON.parse(noteOnStorage)
      }
      return []
    }
    
  )

  function onNoteCreated(content: string, isWritten: boolean) {
    const newNote = {
      id: crypto.randomUUID(),
      date: new Date(),
      content,
      isWritten
    }
    const arrayNotes = [newNote, ...notes]

    setNotes(arrayNotes)

    localStorage.setItem('notes', JSON.stringify(arrayNotes))
  }

  function onNoteDeleted(id: string){
    const newArrayNotes = notes.filter(note => {
      return note.id !== id
    })

    setNotes(newArrayNotes)
    localStorage.setItem('notes', JSON.stringify(newArrayNotes));
  }

  function onNoteEdited(id: string, content: string){
    const updateNote = notes.map(note => {
      if(note.id === id){
        return {...note, date:new Date(),content:content}
      }
      return note
    })  

    setNotes(updateNote)
    localStorage.setItem('notes', JSON.stringify(updateNote))
  }

  function handleSearch(event:ChangeEvent<HTMLInputElement>){

    const query = event.target.value

    setSearch(query)
  }

  const filteredNotes = search !== '' ? notes.filter(note => note.content.toLowerCase().includes(search.toLowerCase())) : notes

  return (
    <div className="mx-auto max-w-6xl px-5 my-12 space-y-6">
      <form className="w-full">
        <input
          onChange={handleSearch}
          type="text"
          className="w-full bg-transparent text-3xl font-semibold tracking-tighter outline-none placeholder: text-slate-500"
          placeholder="busque suas notas ..."
        />
      </form>

      <div className="h-px bg-slate-700" />

      <div
        id="content-notes"
        className="grid gap-6 grid-cols-1 md:grid-cols-3 auto-rows-[250px]"
      >
        <NewNoteCard onNoteCreated = {onNoteCreated}/>

        {filteredNotes.map(note => {
          return <NoteCard key={note.id} note={note}
          onNoteDeleted={onNoteDeleted}onNoteEdited = {onNoteEdited}
          />
        })}
      </div>
    </div>
  )
}

export default App
