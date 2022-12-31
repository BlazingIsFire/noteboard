import React, { useState, useEffect, useRef } from 'react';
import '../index.css';
import './Home.css';
import { db } from '../firebase';
import Note from '../components/Note';
import { useAuth } from '../contexts/AuthContext';
import { ReactComponent as Add } from '../imgs/add.svg';
import { doc, onSnapshot, query, collection, setDoc, updateDoc, serverTimestamp, orderBy } from 'firebase/firestore';


function Home() {
    // Firebase states & refs
    const { currentUser } = useAuth();
    const noteboardUserRef = doc(db, `noteboard-app/${currentUser.uid}`);
    const noteboardUserNotesCollectionRef = collection(db, `noteboard-app/${currentUser.uid}/userNotes`);
    const noteboardUserNotesDocRef = doc(noteboardUserNotesCollectionRef)
    // useStates
    const [notes, setNotes] = useState([]);
    const [darkmode, setDarkMode] = useState('');
    const [pageTheme, setPageTheme] = useState();
    const [addNoteModal, setAddNoteModal] = useState(false);
    const [addNoteColor, setAddNoteColor] = useState('white');
    // useRefs
    const addNoteTitleRef = useRef();
    const addNoteContentRef = useRef();

    //useEffect (runs functions when a note is updated and on page load.)
    useEffect(()=>{
        findDarkMode();
        findNotes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // ========= Start of all functions =========

    // Finds darkmode or lightmode status on page load. (uses snapshot to update)
    const findDarkMode = ()=>{
        const unsub = onSnapshot(doc(db, 'noteboard-app', currentUser.uid), {
            includeMetadataChanges: true
        }, async (docSnap)=>{
            try{
                setDarkMode(docSnap.data().darkmode)
                if(docSnap.data().darkmode === true){
                    setPageTheme('darkmode')
                } else {
                    setPageTheme('lightmode')
                }
            }catch{
                setDarkMode(false)
                setPageTheme('lightmode')
            }
        })
        return unsub;
    }

    // finds notes on page load. (uses snapshot to update)
    const findNotes = async ()=>{
        const userNoteQuery = query(noteboardUserNotesCollectionRef, orderBy('noteDate', 'desc'))
        const noteboardFirebase = onSnapshot(userNoteQuery, (querySnapshot)=>{
            let noteArr = []
            querySnapshot.forEach((doc)=>{
                noteArr.push({...doc.data(), noteId: doc.id})
            });
            setNotes(noteArr);
            console.log(notes)
        })
        return;
    }
    
    // Update and change Dark Mode status
    const handleDarkModeSlider = async () =>{
        setDarkMode(!darkmode)
        if(pageTheme === 'darkmode'){
            setPageTheme('lightmode')
        } else {
            setPageTheme('darkmode')
        }
        await updateDoc(noteboardUserRef, {
            darkmode: !darkmode
        });
    }

    // Add a new note function
    const handleAddNewNote = async (e) =>{
        e.preventDefault()
        // check if color is null, if null then set default white.
        if(addNoteColor === null){
            await setDoc(noteboardUserNotesDocRef, {
                noteTitle: addNoteTitleRef.current.value,
                noteContent: addNoteContentRef.current.value,
                noteColor: 'white',
                noteDate: serverTimestamp()
            })
        } else {
            console.log('its not null')
            await setDoc(noteboardUserNotesDocRef, {
                noteTitle: addNoteTitleRef.current.value,
                noteContent: addNoteContentRef.current.value,
                noteColor: addNoteColor,
                noteDate: serverTimestamp()
            })
        }
        setAddNoteColor('white');
        setAddNoteModal(false);
        addNoteTitleRef.current.value = '';
        addNoteContentRef.current.value = '';
    }

    // Cancels Add note modal and resets states / refs.
    const handleAddNoteCancel = (e) =>{
        addNoteTitleRef.current.value = '';
        addNoteContentRef.current.value = '';
        setAddNoteColor('white')
        return setAddNoteModal(false);
    }
    
  return (
    <>
    <div className='home-container' id={pageTheme}>
        <div className='home-header flex'>
            <h1 className='font-carter-one'>Noteboard</h1>
            <div className='home-header-dark-container'>
                <label className='font-carter-one'>Dark Mode</label>
               <span className='home-header-dark-mode'>
                    <input type='checkbox' checked={darkmode} readOnly/>
                    <span className='dark-mode-slider pointer' onClick={handleDarkModeSlider}/>
                </span>
            </div>
        </div>
        <div className='home-body flex-center-all'>
            <div className='home-new-note flex-center-all flex-column pointer' onClick={()=>{setAddNoteModal(true)}}>
                <Add className='pointer' id='new-note'/>
                <h2 className='font-carter-one'>Add Note</h2>
            </div>
            {notes.map(((note, index) => <Note key={index} note={note} theme={pageTheme}/>))}
        </div>
    </div>
    <div className={`${addNoteModal ? 'addnote-modal-container flex-center-all' : 'display-none'}`}>
        <div className='addnote-modal-box flex-column'>
            <form onSubmit={handleAddNewNote}>
                <h1>Add a new note:</h1>
                <label className='font-carter-one'>Note Title:</label><br/>
                <input ref={addNoteTitleRef} type='text' placeholder='Add title...' autoFocus required/><br/>
                <label className='font-carter-one'>Note Content:</label><br/>
                <textarea ref={addNoteContentRef} placeholder='Add Content...' required/><br/>
                <div className='addnote-colors-container flex flex-start'>
                    <input type='checkbox' name='addnote-color-white'/>
                    <span className='addnote-color pointer' id={`${addNoteColor === '#ffffff' ? 'addnote-color-selected' : 'addnote-color-default'}`} style={{'--addnote-color-selector': '#ffffff'}} onClick={()=>{setAddNoteColor('#ffffff')}}/>
                    <input type='checkbox' name='addnote-color-dark'/>
                    <span className='addnote-color pointer' id={`${addNoteColor === '#282c34' ? 'addnote-color-selected' : 'addnote-color-default'}`} style={{'--addnote-color-selector': '#282c34'}} onClick={()=>{setAddNoteColor('#282c34')}}/>
                    <input type='checkbox' name='addnote-color-red'/>
                    <span className='addnote-color pointer' id={`${addNoteColor === '#ff0000' ? 'addnote-color-selected' : 'addnote-color-default'}`} style={{'--addnote-color-selector': '#ff0000'}} onClick={()=>{setAddNoteColor('#ff0000')}}/>
                    <input type='checkbox' name='addnote-color-yellow'/>
                    <span className='addnote-color pointer' id={`${addNoteColor === '#ffee00' ? 'addnote-color-selected' : 'addnote-color-default'}`} style={{'--addnote-color-selector': '#ffee00'}} onClick={()=>{setAddNoteColor('#ffee00')}}/> 
                    <input type='checkbox' name='addnote-color-green'/>
                    <span className='addnote-color pointer' id={`${addNoteColor === '#1eff00' ? 'addnote-color-selected' : 'addnote-color-default'}`} style={{'--addnote-color-selector': '#1eff00'}} onClick={()=>{setAddNoteColor('#1eff00')}}/>
                    <input type='checkbox' name='addnote-color-cyan'/>
                    <span className='addnote-color pointer' id={`${addNoteColor === '#00d9ff' ? 'addnote-color-selected' : 'addnote-color-default'}`} style={{'--addnote-color-selector': '#00d9ff'}} onClick={()=>{setAddNoteColor('#00d9ff')}}/>
                    <input type='checkbox' name='addnote-color-blue'/>
                    <span className='addnote-color pointer' id={`${addNoteColor === '#3700ff' ? 'addnote-color-selected' : 'addnote-color-default'}`} style={{'--addnote-color-selector': '#3700ff'}} onClick={()=>{setAddNoteColor('#3700ff')}}/>
                    <input type='checkbox' name='addnote-color-purple'/>
                    <span className='addnote-color pointer' id={`${addNoteColor === '#c300ff' ? 'addnote-color-selected' : 'addnote-color-default'}`} style={{'--addnote-color-selector': '#c300ff'}} onClick={()=>{setAddNoteColor('#c300ff')}}/>
                    <input type='checkbox' name='addnote-color-pink'/>
                    <span className='addnote-color pointer' id={`${addNoteColor === '#FF69B4' ? 'addnote-color-selected' : 'addnote-color-default'}`} style={{'--addnote-color-selector': '#FF69B4'}} onClick={()=>{setAddNoteColor('#FF69B4')}}/>
                </div>
                <input type='submit' value='Add Note' id='addnote-submit-btn' className='pointer'/>
                <input type='button' value='Cancel' id='addnote-cancel-btn' className='pointer' onClick={handleAddNoteCancel}/>
            </form>
        </div>
    </div>
    </>
  )
}

export default Home;