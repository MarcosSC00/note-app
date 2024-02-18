import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { ChangeEvent, useState } from 'react'
import { toast } from 'sonner'
import React from 'react'

interface NewNoteCardsProps{
  onNoteCreated: (content: string, isWritten: boolean) => void
}

export function NewNoteCard({onNoteCreated}:NewNoteCardsProps) {

  const [content, setContent] = useState('')
  const [shouldShowOnBoard, setShouldShowOnBoard] = useState(true)
  const [isRecording, setIsRecording] = useState(false)
  const [isWritten, setIsWritten] = useState(true)

  let speechRecognition: SpeechRecognition | null = null

  function closeModal(){
    setShouldShowOnBoard(true)
    setIsRecording(false)
  }

  function handleStartEditor(){
    setShouldShowOnBoard(false)
    setContent('')
    setIsWritten(true)
  }

  function handleStartRecording(){

    const isSpeechRecognitionAPIAvailable = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window

    if(!isSpeechRecognitionAPIAvailable){
      alert('Infelizmente seu navegador não suporta a API de gravação!')
      return
    }

    setIsRecording(true)
    setShouldShowOnBoard(false)
    setContent('')
    setIsWritten(false)

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition

    speechRecognition = new SpeechRecognitionAPI()

    speechRecognition.lang = 'pt-BR'
    speechRecognition.maxAlternatives = 1
    speechRecognition.interimResults = true

    speechRecognition.onresult = (event) =>{
      const transcription =Array.from(event.results).reduce((text, result) => {
        return text.concat(result[0].transcript)
      }, '')

      setContent(transcription)
    }

    speechRecognition.onerror = (event) => {
      console.error(event)
    }
    speechRecognition.start()
  }

  function handleStopRecording(){
    setIsRecording(false)
    if(speechRecognition != null){
      speechRecognition.stop()
    }
  }

  function handleContentChanged(event: ChangeEvent<HTMLTextAreaElement>){
    setContent(event.target.value)
    if(event.target.value === ''){
      setShouldShowOnBoard(true)
    }
  }

  function handleSalveNote(){
    if(content === ''){
      return
    }
    
    onNoteCreated(content, isWritten)
  
    setContent('')
    setShouldShowOnBoard(true)

    toast.success('Nota salva com sucesso!')
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger
        className="flex flex-col gap-3 text-left p-5 overflow-hidden outline-none hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400 rounded-md bg-slate-700
      "
      onClick={closeModal}
      >
        <span className="text-sm leading-6 text-slate-200">Adicionar nota</span>
        <p className="text-sm leading-6 text-slate-400">
          grave uma nota em áudio que será convertida em texo automaticamente.
        </p>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Content className="fixed  bg-slate-700 flex flex-col w-full overflow-hidden inset-0 md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] md:h-[60vh] md:rounded-md">
          <Dialog.Close className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-300 hover:text-slate-50">
            <X className="size-5" />
          </Dialog.Close>

          <div className="flex flex-col flex-1">
            <div className="flex flex-1 flex-col gap-3 p-5">
              <span className="text-sm font-medium text-slate-300">
                Adicionar nota
              </span>

              {shouldShowOnBoard ? (
                <p className="text-sm leading-6 text-slate-400">
                Comece{' '}
                <button onClick={handleStartRecording} className="font-medium text-lime-400 hover:underline">
                  gravando uma nota{' '}
                </button>{' '}
                em áudio ou se preferir{' '}
                <button onClick={handleStartEditor} className="font-medium text-lime-400 hover:underline">
                  {' '}
                  utilize apenas texto.
                </button>
              </p>
              ) : (
                <textarea id='txtArea' onChange={handleContentChanged} className='text-sm bg-transparent leading-6 text-lime-400 resize-none flex-1 outline-none' autoFocus value={content}/>
              )}

            </div>

            {isRecording ? (
              <button className='flex items-center justify-center gap-2 bg-slate-900 w-full p-4 text-center text-sm text-slate-300 outline-none font-medium hover:text-slate-100'
              onClick={handleStopRecording}>
              <div className="size-3 rounded-full bg-red-500 animate-pulse" />
              Gravando! (clique aqui para interromper)
            </button>
            ) : (
              <button className="bg-lime-400 w-full py-4 text-center text-sm text-lime-950 outline-none font-medium hover:bg-lime-500"
              onClick={handleSalveNote}>
              Salvar nota
            </button>
            )}

          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
