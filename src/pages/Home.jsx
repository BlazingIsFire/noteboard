import React, { useState, useEffect, useRef } from 'react';
import '../index.css';
import './Home.css';
import Note from '../components/Note';
import { db, auth } from '../firebase';
import { signOut } from 'firebase/auth';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../contexts/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import { ReactComponent as Add } from '../imgs/add.svg';
import { ReactComponent as Logout } from '../imgs/logout.svg';
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
    const [modifyNoteData, setModifyNoteData] = useState();
    const [addNoteModal, setAddNoteModal] = useState(false);
    const [addNoteColor, setAddNoteColor] = useState('#ffffff');
    const [modifyNoteColor, setModifyNoteColor] = useState();
    // useRefs
    const addNoteTitleRef = useRef();
    const addNoteContentRef = useRef();
    const modifyModalRef = useRef();
    const modifyNoteTitleRef = useRef(null);
    const modifyNoteContentRef = useRef(null);

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
        })
        return noteboardFirebase;
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
        toast.success('Successfully added the note!');
    }

    // Cancels Add note modal and resets states / refs.
    const handleAddNoteCancel = (e) =>{
        addNoteTitleRef.current.value = '';
        addNoteContentRef.current.value = '';
        setAddNoteColor('white')
        return setAddNoteModal(false);
    }

    // Updates note data (Modify Note)
    const handleModifyNote = async (e) => {
        e.preventDefault();
        const noteboardNoteRef = doc(db, `noteboard-app/${currentUser.uid}/userNotes`, modifyNoteData.noteId)
        await updateDoc(noteboardNoteRef, {
            noteTitle: modifyNoteTitleRef.current.value,
            noteContent: modifyNoteContentRef.current.value,
            noteColor: modifyNoteColor
        });
        handleModifyNoteCancel();
        toast.success('Note updated successfully!');
    }

    // Cancels Modify Note modal and resets states.
    const handleModifyNoteCancel = (e) => {
        modifyModalRef.current.className = 'display-none';
        setModifyNoteColor('');
        setModifyNoteData(null);
    }

    // Retreives data from Note and sets data to object state.
    const getNoteData = (data) => {
        setModifyNoteData(data);
        modifyNoteTitleRef.current.value = data.noteTitle;
        modifyNoteContentRef.current.value = data.noteContent;
        setModifyNoteColor(data.noteColor);
    }

    // Prompts Toastify of note deletion. 
    const getDeleteData = (data) => {
        toast.success(data);
    }

    // Signs user out of application.
    const handleSignOut = async () => {
        await signOut(auth).then(()=>{
            return;
        }).catch((error)=>{
            console.log(error.code + ': Error on sign out.');
            return toast.error('Error signing out!');
        })
    }
    
  return (
    <>
    <div className='home-container' id={pageTheme}>
        <div className='home-header flex'>
            <h1 className='font-carter-one'>Noteboard</h1>
            <div className='flex flex-row'>
                <div className='home-header-dark-container'>
                    <label className='font-carter-one'>Dark Mode</label>
                    <span className='home-header-dark-mode'>
                        <input type='checkbox' checked={darkmode} readOnly/>
                        <span className='dark-mode-slider pointer' onClick={handleDarkModeSlider}/>
                    </span>
                </div>
                <Logout className='pointer' id='logout-svg' onClick={handleSignOut}/>
            </div>
        </div>
        <div className='home-body flex-center-all'>
            <div className='home-new-note flex' onClick={()=>{setAddNoteModal(true)}}>
                <Add className='pointer' id='new-note'/>
                <h2 className='font-carter-one'>Add Note</h2>
            </div>
            {notes.map(((note, index) => <Note key={index} note={note} theme={pageTheme} noteData={getNoteData} noteDelete={getDeleteData}/>))}
        </div>
        <ToastContainer position='bottom-right' theme={`${pageTheme === 'darkmode' ? 'dark' : 'light'}`} draggable={false} pauseOnHover={false}/>
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
                    <span className='addnote-color pointer' id={`${addNoteColor === '#ffffff' || addNoteColor === undefined ? 'addnote-color-selected' : 'addnote-color-default'}`} style={{'--addnote-color-selector': '#ffffff'}} onClick={()=>{setAddNoteColor('#ffffff')}}/>
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
    <div ref={modifyModalRef} className='display-none' id='modify-modal'>
      <div className='modify-note-box'>
        <form id='modify-note' onSubmit={handleModifyNote}>
            <h1>Modify a note:</h1>
            <label className='font-carter-one'>Note Title:</label><br/>
            <input ref={modifyNoteTitleRef} type='text' defaultValue={`${modifyNoteData ? modifyNoteData.noteTitle : ''}`} placeholder='Modify title...' required/><br/>
            <label className='font-carter-one'>Note Content:</label><br/>
            <textarea ref={modifyNoteContentRef} defaultValue={`${modifyNoteData ? modifyNoteData.noteContent : ''}`} placeholder='Modify Content...' required/><br/>
            <div className='modifynote-colors-container flex flex-start'>
                <input type='checkbox' name='modifynote-color-white'/>
                <span className='modifynote-color pointer' id={`${modifyNoteColor === '#ffffff' ? 'modifynote-color-selected' : 'modifynote-color-default'}`} style={{'--modifynote-color-selector': '#ffffff'}} onClick={()=>{setModifyNoteColor('#ffffff')}}/>
                <input type='checkbox' name='modifynote-color-dark'/>
                <span className='modifynote-color pointer' id={`${modifyNoteColor === '#282c34' ? 'modifynote-color-selected' : 'modifynote-color-default'}`} style={{'--modifynote-color-selector': '#282c34'}} onClick={()=>{setModifyNoteColor('#282c34')}}/>
                <input type='checkbox' name='modifynote-color-red'/>
                <span className='modifynote-color pointer' id={`${modifyNoteColor === '#ff0000' ? 'modifynote-color-selected' : 'modifynote-color-default'}`} style={{'--modifynote-color-selector': '#ff0000'}} onClick={()=>{setModifyNoteColor('#ff0000')}}/>
                <input type='checkbox' name='modifynote-color-yellow'/>
                <span className='modifynote-color pointer' id={`${modifyNoteColor === '#ffee00' ? 'modifynote-color-selected' : 'modifynote-color-default'}`} style={{'--modifynote-color-selector': '#ffee00'}} onClick={()=>{setModifyNoteColor('#ffee00')}}/> 
                <input type='checkbox' name='modifynote-color-green'/>
                <span className='modifynote-color pointer' id={`${modifyNoteColor === '#1eff00' ? 'modifynote-color-selected' : 'modifynote-color-default'}`} style={{'--modifynote-color-selector': '#1eff00'}} onClick={()=>{setModifyNoteColor('#1eff00')}}/>
                <input type='checkbox' name='modifynote-color-cyan'/>
                <span className='modifynote-color pointer' id={`${modifyNoteColor === '#00d9ff' ? 'modifynote-color-selected' : 'modifynote-color-default'}`} style={{'--modifynote-color-selector': '#00d9ff'}} onClick={()=>{setModifyNoteColor('#00d9ff')}}/>
                <input type='checkbox' name='modifynote-color-blue'/>
                <span className='modifynote-color pointer' id={`${modifyNoteColor === '#3700ff' ? 'modifynote-color-selected' : 'modifynote-color-default'}`} style={{'--modifynote-color-selector': '#3700ff'}} onClick={()=>{setModifyNoteColor('#3700ff')}}/>
                <input type='checkbox' name='modifynote-color-purple'/>
                <span className='modifynote-color pointer' id={`${modifyNoteColor === '#c300ff' ? 'modifynote-color-selected' : 'modifynote-color-default'}`} style={{'--modifynote-color-selector': '#c300ff'}} onClick={()=>{setModifyNoteColor('#c300ff')}}/>
                <input type='checkbox' name='modifynote-color-pink'/>
                <span className='modifynote-color pointer' id={`${modifyNoteColor === '#FF69B4' ? 'modifynote-color-selected' : 'modifynote-color-default'}`} style={{'--modifynote-color-selector': '#FF69B4'}} onClick={()=>{setModifyNoteColor('#FF69B4')}}/>
            </div>
            <input type='submit' value='Update Note' id='modifynote-submit-btn' className='pointer'/>
            <input type='button' value='Cancel' id='addnote-cancel-btn' className='pointer' onClick={handleModifyNoteCancel}/>
        </form>
      </div>
    </div>
    </>
  )
}

export default Home;