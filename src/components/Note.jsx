import React, { useEffect, useRef, useState } from 'react';
import '../index.css';
import './Note.css'
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { deleteDoc, doc } from 'firebase/firestore';
import { ReactComponent as Trashbin } from '../imgs/trash.svg';

function Note({ note, theme }) {
  // sets theme to dark or light mode
  const pageTheme = theme;
  // Auth
  const { currentUser } = useAuth();
  // all useStates
  const [noteDate, setNoteDate] = useState(null);

  useEffect(()=>{
    findDate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
  }

  return (
    <>
    <div className='note pointer' id={pageTheme}>
        <div className='note-header flex' style={{backgroundColor: `${note.noteColor}`}}>
                <h4 className='font-carter-one'>{noteDate}</h4>
            <Trashbin className='pointer' id='trash-svg' onClick={handleNoteDelete}/>
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