import React, { useState, useEffect } from 'react';
import '../index.css';
import './Home.css';
import Note from '../components/Note';
import { ReactComponent as Add } from '../imgs/add.svg';


function Home() {
    const [username, setUsername] = useState('Blazing');
    const [settingsModal, setSettingsModal] = useState(false);
  return (
    <>
    <div className='home-container'>
        <div className='home-header flex'>
            <h1 className='font-carter-one'>Noteboard</h1>
            <div className='home-header-dark-container'>
                <label className='font-carter-one'>Dark Mode</label>
               <span className='home-header-dark-mode'>
                    <input type='checkbox' />
                    <span className='dark-mode-slider pointer'/>
                </span> 
            </div>
            
        </div>
        <div className='home-body flex-center-all'>
            <div className='home-new-note flex-center-all flex-column pointer'>
                <Add className='pointer' id='new-note'/>
                <h2 className='font-carter-one'>Add Note</h2>
            </div>
            <Note />
            <Note />
        </div>
    </div>
    <div className={`${settingsModal ? 'settings-modal-container flex-center-all' : 'display-none'}`}>
        <div className='settings-modal-box flex-center-all'>
            <h1>Noteboard Settings:</h1>
                        
        </div>
    </div>
    </>
  )
}

export default Home;