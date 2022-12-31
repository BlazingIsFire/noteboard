import React, { useState, useRef, useEffect } from 'react'
import '../index.css';
import './LoginPage.css';
import { auth, db, noteboardCollectionRef } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { addDoc, collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { ReactComponent as LoginSVG } from '../imgs/sticky-note.svg';
import notebookImg from '../imgs/notebook-128.png';

function Login() {
    // all useRef's
    const emailRef = useRef();
    const passwordRef = useRef();
    // all useState's
    const [loginModal, setLoginModal] = useState(false);
    const [errorText, setErrorText] = useState('');
    // Misc.
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    // Checks if a user is already signed in
    useEffect(() =>{
        if(currentUser){
            return navigate('home');
        } else{
            return
        }
    })

    // Login Function
    const handleLogin = async (e) =>{
        e.preventDefault();
        await signInWithEmailAndPassword(auth, emailRef.current.value, passwordRef.current.value)
            .then(async (userCredential) =>{
                const user = userCredential.user;
                const noteboardUserDocRef = doc(noteboardCollectionRef, user.uid);
                const userDoc = await getDoc(noteboardUserDocRef)
                if(userDoc.exists()){
                    return navigate('home');
                } else {
                    await setDoc(noteboardUserDocRef, {darkmode: false})
                    .then(()=>{
                        return navigate('home');
                    })
                }
            }).catch((error) =>{
                const errorCode = error.code;
                setLoginModal(true);
                switch(errorCode){
                    case 'auth/user-not-found':
                        setErrorText('No user was found with that email address.');
                        break;
                    case 'auth/wrong-password':
                        setErrorText('The password entered is incorrect. Please try again.');
                        break;
                    case 'auth/too-many-requests':
                        setErrorText('You have sent to many requests. Please wait a bit and try again later.');
                        break;
                    default:
                        setErrorText('Please contact andrew@andrewschweitzer.tech with the following error code: ' + error.code);
                        console.log(errorCode);
                        break;
                }
            }
        )
    }

  return (
    <>
    <div className='login-container flex-center-all'>
        <div className='login-box flex'>
            <div className='login-box-left flex-center-all'>
                <LoginSVG id='login-svg'/>
            </div>
            <div className='login-box-right flex-center-all flex-column'>
                <img id='login-form-img' src={notebookImg} alt='Notebook'/>
                <h1>Noteboard</h1>
                <h4 className='font-carter-one'>Please login to continue</h4>
                <form className='flex-center-all flex-column' onSubmit={handleLogin}>
                    <input ref={emailRef} className='login-form-input font-carter-one' id='email-input' type='email' placeholder='Email Address' autoFocus required/>
                    <input ref={passwordRef} className='login-form-input font-carter-one' id='password-input' type='password' placeholder='Password' required/>
                    <input className='login-form-btn pointer font-carter-one' id='login-btn' type='submit' value='Login'/>
                </form>
                <h5 className='font-carter-one'>Don't have an account?</h5>
                <a className='font-carter-one pointer' href='https://andrewschweitzer.tech/register' title='Register'>Create an account</a>
            </div>
        </div>
    </div>
    <div className={`${loginModal ? `login-modal flex-center-all` : 'display-none'}`}>
        <div className='login-modal-box flex-center-all flex-column'>
            <h1>Error signing in:</h1>
            <p className='font-carter-one'>{errorText}</p>
            <button className='pointer' onClick={()=>{setLoginModal(false)}}>Close</button>
        </div>
    </div>
    </>
  )
}

export default Login;