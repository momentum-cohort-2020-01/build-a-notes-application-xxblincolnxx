/* globals fetch, moment */

const newNoteForm = dQS('#new-note-form')
const editNoteForm = dQS('#edit-note-form')

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
function openNewNoteForm () {
  closeEditForm()
  dQS('#new-note-form').style.display = 'flex'
}

function closeNewNoteForm () {
  dQS('#new-note-form').style.display = 'none'
}

function openEditForm (noteID) {
  closeNewNoteForm()
  dQS('#edit-note-form').style.display = 'flex'
  getAllNotes()
    .then(noteData => {
      for (let note of noteData) {
        if (note.id === parseInt(noteID)) {
          dQS('#edit-note-title').value = note.noteTitle
          dQS('#edit-note-text').textContent = note.note
          dQS('#note-id').value = note.id
        }
      }
    })
}

function closeEditForm () {
  dQS('#edit-note-form').style.display = 'none'
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
    for (const note of notes) { dQS('#notes-by-date').insertAdjacentHTML('beforeend', createNoteHTML(note)) }
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

function randomPic () {
  dQS('#baby-pic').src = ''
  const randomIndex = Math.abs(Math.floor(Math.random() * Math.floor(babyPics.length) - 1))
  for (let i = 0; i < babyPics.length; i++) {
    if (i === randomIndex) {
      dQS('#baby-pic').src = babyPics[i]
    }
  }
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
// NOTE LIST FUNCTIONS
function viewNote (noteID) {
  console.log('you are trying to view ' + noteID)
}

// function editNote (noteID) {
//   openEditForm()
// }

function deleteNote (noteID) {
  fetch(`http://localhost:3000/notes/${noteID}`, {
    method: 'DELETE'
  })
}

newNoteForm.addEventListener('submit', event => {
  event.preventDefault()
  const noteTitleField = dQS('#note-title')
  const noteTitle = noteTitleField.value
  const noteTextField = dQS('#note-text')
  const noteText = noteTextField.value
  noteTitleField.value = ''
  noteTextField.value = ''
  closeNewNoteForm()
  randomPic()
  // console.log('Note Title:'+noteTitle+'noteText: '+noteText)
  uploadNewNote(noteTitle, noteText)
  displayNotesList()
})

editNoteForm.addEventListener('submit', event => {

})

// VIEW/EDIT/DELETE EVENTS:
dQS('#notes-by-date').addEventListener('click', event => {
  if (event.target.matches('.view-butt')) {
    viewNote(event.target.parentElement.parentElement.dataset.noteId)
  } else if (event.target.matches('.edit-butt')) {
    openEditForm(event.target.parentElement.parentElement.dataset.noteId)
  } else if (event.target.matches('.delete-butt')) {
    deleteNote(event.target.parentElement.parentElement.dataset.noteId)
  }
})

displayNotesList()
randomPic()
