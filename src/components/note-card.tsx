import * as Dialog from '@radix-ui/react-dialog'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Edit, X, Pen, Mic } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner'

interface NoteCardsProps{
  note: {
    id: string,
    date: Date,
    content: string,
    isWritten: boolean
  }
  onNoteDeleted: (id: string) => void
  onNoteEdited: (id: string, content: string) => void
}

export function NoteCard({note, onNoteDeleted, onNoteEdited}: NoteCardsProps) {

  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(note.content)

  function handleEditClick(){
    setIsEditing(true)
  }

  function handleSalveEdit(){

    if(editedContent === ''){
      return
    }

    onNoteEdited(note.id, editedContent)
    setIsEditing(false)

    toast.success('Nota editada com sucesso!')
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger className="rounded-md text-left flex flex-col outline-none bg-slate-800 gap-3 p-5 overflow-hidden relative hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400">
        <div className='absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-black/0'></div>
        <span className="text-sm font-medium text-slate-300">
          {formatDistanceToNow(note.date, {
            locale: ptBR,
            addSuffix: true
          })}
        </span>

        <div className='absolute right-0 top-0 p-2 group flex flex-col gap-2 items-end' onClick={handleEditClick}>
          <Edit className='text-slate-500 hover:text-slate-400'/>
          <p className='hidden group-hover:flex rounded-md bg-slate-700 p-1 text-slate-300'>Editar Nota</p>
        </div>

        <div className='absolute bottom-0 right-0 rounded p-2'>
          {note.isWritten ? (
            <div className='group flex flex-col items-end gap-2'>
            <p className='hidden group-hover:flex p-1 rounded-md bg-slate-700 text-slate-300'>Nota criada por digitação.</p>
            <Pen className='text-slate-500 hover:text-slate-400'/>
          </div>
          ) : (
            <div className='group flex flex-col items-end gap-2'>
              <p className='hidden group-hover:flex p-1 rounded-md bg-slate-700 text-slate-300'>Nota criada por gravação.</p>
              <Mic className='text-slate-500'/>
            </div>
          )}
        </div>


        <p className="text-sm leading-6 text-slate-400">
          {note.content
          }
        </p>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay></Dialog.Overlay>
        <Dialog.Content className="fixed  bg-slate-700 flex flex-col w-full overflow-hidden inset-0 md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] md:h-[60vh] md:rounded-md">
          <Dialog.Close className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-300 hover:text-slate-50 hover:cursor-pointer">
            <X className="size-5" />
          </Dialog.Close>
          <div className=" flex flex-col flex-1 gap-3 p-5">
            <span className="text-sm font-medium text-slate-300">
              {formatDistanceToNow(note.date, {
                locale: ptBR,
                addSuffix: true
              })}
            </span>

            {isEditing ? (
              <textarea className='text-sm leading-6 text-lime-400 resize-none outline-none bg-transparent' value={editedContent} onChange={(e) =>{setEditedContent(e.target.value)}}/>
            ) : (
              <p className="text-sm leading-6 text-slate-400">
                {note.content}
              </p>
            )}
          </div>

          {!isEditing && (
            <button onClick={() => onNoteDeleted(note.id)} className="w-full py-4 bg-slate-800 text-slate-300 p-3 outline-none font-medium group">
            Deseja excluir{' '}
            <span className="text-red-400 group-hover:underline">
              esta nota
            </span>
            ?
            </button>
          )}

          {isEditing && (
            <button
            type='button'
            onClick={handleSalveEdit}
            className='bg-lime-400 w-full py-4 text-center text-sm text-lime-950 outline-none font-medium group'
            >
            Salvar Edição
            </button>
          )}

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
