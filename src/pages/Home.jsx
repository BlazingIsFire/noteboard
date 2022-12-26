import React, { useState, useEffect } from 'react';
import '../index.css';
import './Home.css';
import Note from '../components/Note';
import { ReactComponent as Settings } from '../imgs/setting.svg';
import { ReactComponent as Add } from '../imgs/add.svg';


function Home() {
    const [username, setUsername] = useState('Blazing');
  return (
    <>
    <div className='home-container'>
        <div className='home-header flex'>
            <h1 className='font-carter-one'>Noteboard</h1>
            <span className='font-carter-one flex pointer'>Settings
                <Settings id='settings-svg'/>
            </span>
        </div>
        <div className='home-body flex-center-all'>
            <div className='home-new-note flex-center-all flex-column'>
                <Add className='pointer' id='new-note'/>
                <h2 className='font-carter-one'>Add Note</h2>
            </div>
            <Note />
        </div>
    </div>
    </>
  )
}

export default Home;