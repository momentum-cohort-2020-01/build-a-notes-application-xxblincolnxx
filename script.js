/* globals fetch, moment */

const newNoteForm = document.querySelector('#new-note-form')

function getAllNotes () {
  return fetch('http://localhost:3000/notes/')
    .then(response => response.json())
}

function addNewToListDisplay (note) {
  const title = note.noteTitle
  const text = note.note
  document.querySelector('#recent-title').textContent = title
  document.querySelector('#recent-note').textContent = text
}

function uploadNewNote (title, text) {
  return fetch('http://localhost:3000/notes/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ noteTitle: title, note: text, done: false, created: moment().format() })
  })
    .then(response => response.json())
}

newNoteForm.addEventListener('submit', event => {
  event.preventDefault()
  const noteTitleField = document.querySelector('#note-title')
  const noteTitle = noteTitleField.value
  const noteTextField = document.querySelector('#note-text')
  const noteText = noteTextField.value
  noteTitleField.value = ''
  noteTextField.value = ''
  // console.log('Note Title:'+noteTitle+'noteText: '+noteText)
  uploadNewNote(noteTitle, noteText).then(addNewToListDisplay)
})
