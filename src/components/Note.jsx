import React from 'react';
import '../index.css';
import './Note.css'
import { ReactComponent as Trashbin } from '../imgs/trash.svg';

function Note() {
  return (
    <div className='note'>
        <div className='note-header flex-center-all'>
            <text className='font-carter-one'>01/01/0000</text>
            <Trashbin className='pointer' id='trash-svg'/>
        </div>
        <div className='note-body flex flex-column'>
            <text className='note-title'>Test Title</text>
            <p className='note-content'>Akpjasdkjaskdjaskdjaklsjdkasjdlasjdklasjdajsdlajsldk askdmakm kkn akmsdkamk; k aksdakspd askdlaskdaskdjaksdaskdjkk aksndkasdkknk nkalsnd lansldnasl d</p>
        </div>
    </div>     
  )
}

export default Note;