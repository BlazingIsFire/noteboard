import React from 'react';
import '../index.css';
import './Note.css'
import { ReactComponent as Trashbin } from '../imgs/trash.svg';

function Note() {
  return (
    <>
    <div className='note pointer'>
        <div className='note-header flex-center-all' style={{backgroundColor: '#ff0000'}}>
            <h4 className='font-carter-one'>01/01/0000</h4>
            <Trashbin className='pointer' id='trash-svg'/>
        </div>
        <div className='note-body flex flex-column'>
            <h1 className='note-title'>Test Title</h1>
            <p className='note-content'>This is some text.</p>
        </div>
    </div>  
    </>   
  )
}

export default Note;