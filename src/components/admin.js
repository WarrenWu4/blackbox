import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { auth } from "../firebase";
import {signInWithEmailAndPassword } from "firebase/auth";
import { ImArrowRight } from "react-icons/im";

export default function Admin(props) {

    const navigate = useNavigate();
    const emailRef = useRef()
    const passRef = useRef()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false);

    function handleSubmit(e) {
        e.preventDefault();
        try {
            setLoading(true);
            setError('')
            signInWithEmailAndPassword(auth, emailRef.current.value, passRef.current.value).then(() => {
                navigate("/");
            }).catch(() => {
                setError("Not a valid admin account. Permissions failed");
            })

        } catch {
            setError("External error occurred");
        }

        // reset values
        setLoading(false);
        emailRef.current.value = ""
        passRef.current.value = ""
    }

    return (
        <div className='admin'>
            <form onSubmit={handleSubmit} className='admin-form'>
                <label className='admin-label'>Admin Login</label>
                <input className='admin-input' type='email' ref={emailRef} placeholder="Email" required></input>
                <input className='admin-input' type='password' ref={passRef} placeholder="Password" required></input>
                <button className='admin-btn' disabled={loading} type='submit'>
                    <ImArrowRight/>
                </button>
            </form>
            <div className='admin-error'>
                {error}
            </div>
        </div>

    )
}