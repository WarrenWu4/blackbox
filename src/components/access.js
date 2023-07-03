import { RxCube, RxQuestionMarkCircled } from "react-icons/rx";
import { FaArrowRight } from "react-icons/fa"
import { Modal } from "@mui/material";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { db } from "../firebase"
import { getDoc, doc, setDoc } from "firebase/firestore";

export default function Access() {

      const [open, setOpen] = useState(false);
      const [error, setError] = useState(false);
      const handleOpen = () => setOpen(true);
      const handleClose = () => setOpen(false);
      const code = useRef();
      const nav = useNavigate()

    useEffect(() => {

        // TODO display loading screen while authenticating

        const getToken = async () => {
            const token = localStorage.getItem("blackbox_id");
            if (token !== null) {
                const token_verif = (await getDoc(doc(db, "users", token))).exists();
                if (token_verif) {
                    nav("/blackbox");
                }
            }
        }

        getToken();

    }, [])

      const validateCode = async (e) => {
        e.preventDefault();

        //if access code is correct
        if (code.current.value === process.env.REACT_APP_ACCESS_CODE) {
            // generate unique id
            let uuid = Math.floor(Math.random() * Math.floor(Math.random() * Date.now()));
            try {
                // if possible try to use a 3rd party uuid for more security
                uuid = crypto.randomUUID()
            } catch(err) {
                console.log("UUID via crypto not supported")
            }

            // double check it doesn't already exist by cross checking with firebase
            let data = await getDoc(doc(db, "users", uuid));
            while (data.exists()) {            
                uuid = Math.floor(Math.random() * Math.floor(Math.random() * Date.now()));
                try {
                    // if possible try to use a 3rd party uuid for more security
                    uuid = crypto.randomUUID()
                    console.log(uuid);
                } catch(err) {
                    console.log("UUID via crypto not supported")
                }
                data = await getDoc(doc(db, "users", uuid));
            }

            // store it in local storage and firebase
            localStorage.setItem("blackbox_id", uuid)
            await setDoc(doc(db, "users", uuid), {
                admin: false,
            })

            // navigate to blackbox
            nav("/blackbox")
            
        }
        // otherwise trigger failure code
        else {
            setError(true);
        }

        // reset input in form
        code.current.value = ""
      }

    return (
        <div className="w-full h-[40rem] flex flex-col items-center">

            <RxCube className="text-[white] text-[12rem] m-[1.6rem]" strokeWidth={0.4} />
            <div className="text-[white] text-[4rem] font-bold text-center m-[1.6rem] flex">enter secret access code to start blackbox <RxQuestionMarkCircled className="ml-[1.2rem] mt-[1.2rem] text-[2rem] cursor-pointer" strokeWidth={0.4} onClick={handleOpen}/></div>        
            <form className="flex justify-center items-center">
                <input className="w-[40rem] h-[5.6rem] bg-[white] text-[black] text-[2.8rem] font-bold px-[1.2rem] py-[0.4rem] rounded-[0.8rem]" type="password" placeholder="code" ref={code}/>
                <button className="h-[5.6rem] aspect-square bg-[white] text-[black] rounded-[0.8rem] ml-[2rem] flex justify-center items-center cursor-pointer" onClick={validateCode}> <FaArrowRight className="text-[2.8rem]"/> </button>
            </form>

            <div className="text-[#DA7F7F] font-bold text-[2rem] mt-[2rem]" style={{display:(error) ? "flex":"none"}}>incorrect access code</div>

            <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            >
                <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[50rem] rounded-[0.8rem] bg-[#2C3333] px-[2.4rem] py-[3.6rem] text-[white] font-bold text-[2rem]">
                
                    The access code is hidden somewhere on my <a className="text-[#A5C9CA] font-bold text-[2rem] decoration-solid underline decoration-[#A5C9CA] decoration-4" target="_blank" href="https://warrenwu.vercel.app/">portfolio</a>. While you're there, might as well check out some of my stuff 😊
                    <br/><br/>
                    <span className="text-[#DA7F7F] font-bold text-[2rem]">Hint: it's somewhere on the home page.</span>
                    
                </div>
            </Modal>

            <div className="text-[1.2rem] text-[white] font-bold absolute bottom-[1.6rem] left-[1.6rem]">Made with 💚 by Warren Wu</div>

        </div>
    )
}