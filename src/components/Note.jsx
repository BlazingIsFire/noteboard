import React, { useEffect, useRef, useState } from 'react';
import '../index.css';
import './Note.css'
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { deleteDoc, doc } from 'firebase/firestore';
import { ReactComponent as Trashbin } from '../imgs/trash.svg';
import { ReactComponent as EditPencil } from '../imgs/edit.svg';

function Note({ note, theme, ...props }) {
  // sets theme to dark or light mode
  const pageTheme = theme;
  // Auth
  const { currentUser } = useAuth();
  // all useStates
  const [noteDate, setNoteDate] = useState(null);
  const modifyModalRef = useRef(document.getElementById('modify-modal'));

  // useEffect
  useEffect(()=>{
    findDate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

    // ========= Start of all functions =========

  // finds the date of the note, else sets it at todays date.
  const findDate = async () =>{
    try{
      const firebaseNoteDate = await note.noteDate;
      const noteDateOrg = new Date(firebaseNoteDate.seconds * 1000).toLocaleDateString('en-US');
      setNoteDate(noteDateOrg)
    }catch{
      const today = new Date()
      const todayDate = today.toLocaleDateString('en-US');
      setNoteDate(todayDate);
    }
  }

  // Deletes an note
  const handleNoteDelete = async () => {
    await deleteDoc(doc(db, `noteboard-app/${currentUser.uid}/userNotes`, note.noteId))
    props.noteDelete('Note successfully deleted!')
  }

  // Sets Modify modal to open and passes note data through to Home.jsx
  const handleOpenModifyModal = (e) => {
    modifyModalRef.current.className = 'modify-note-container flex-center-all';
    props.noteData(note);
  }


  return (
    <>
    <div className='note' id={pageTheme}>
        <div className='note-header flex' style={{backgroundColor: `${note.noteColor}`}}>
          <h4 className='font-carter-one'>{noteDate}</h4>
          <div>
            <EditPencil className='pointer' id='editpencil-svg' onClick={handleOpenModifyModal}/>
            <Trashbin className='pointer' id='trash-svg' onClick={handleNoteDelete}/>
          </div>
        </div>
        <div className='note-body flex flex-column'>
            <h1 className='note-title'>{note.noteTitle}</h1>
            <p className='note-content'>{note.noteContent}</p>
        </div>
    </div>
    </>   
  )
}

export default Note;