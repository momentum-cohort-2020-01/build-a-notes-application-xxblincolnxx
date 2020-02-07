/* globals fetch, moment, openForm */

const newNoteForm = document.querySelector('#new-note-form')

// SHORTCUT FUNCTIONS
function dQS (elementID) {
  return document.querySelector(elementID)
}
function dQSA (elementClass) {
  return document.querySelectorAll(elementClass)
}

function getAllNotes () {
  return fetch('http://localhost:3000/notes/')
    .then(response => response.json())
}

// POPUP FUNCTIONS
function openForm () {
  dQS('#new-note-form').style.display = 'flex'
}

function closeForm () {
  dQS('#new-note-form').style.display = 'none'
}

// CONTENT DISPLAY FUNCTIONS
function addNewToListDisplay (note) {
  const title = note.noteTitle
  const text = note.note
  dQS('#recent-title').textContent = title
  dQS('#recent-note').textContent = text
}

function displayNotesList () {
  getAllNotes().then(notes => {
    for (let note of notes)
      dQS('#notes-by-date').insertAdjacentHTML('beforeend', createNoteHTML(note))
    // console.log(date, title)
  })
}

function createNoteHTML (note) {
  return `<li data-note-id='${note.id}'> <p>
       <span class='bold'> ${moment(note.created).format('ll')}  :   </span>   ${note.noteTitle} </p>
      <div class='list-buttons'>
      <button class='view-butt' title='View Current'>VIEW</button>
      <button class='edit-butt' title='Edit Current'>EDIT</button>
      <button class='delete-butt' title='Delete Current'>DEL</button> 
      </div>
      </li>`
}

// API FUNCTIONS
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
  const noteTitleField = dQS('#note-title')
  const noteTitle = noteTitleField.value
  const noteTextField = dQS('#note-text')
  const noteText = noteTextField.value
  noteTitleField.value = ''
  noteTextField.value = ''
  closeForm()
  // console.log('Note Title:'+noteTitle+'noteText: '+noteText)
  uploadNewNote(noteTitle, noteText).then(addNewToListDisplay)
})

displayNotesList()
