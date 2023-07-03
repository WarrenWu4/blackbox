import { RxCube } from "react-icons/rx"
import { BsArrowRight } from "react-icons/bs";
import { useRef, useState } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";

export default function Access() {

    const nameRef = useRef()
    const codeRef = useRef()
    const [error, setError] = useState(false);

    const handleAccess = async (e) => {
        e.preventDefault()
        const usercode = codeRef.current.value
        const username = nameRef.current.value

        if (usercode === process.env.REACT_APP_ACCESS_CODE) {

            await signInAnonymously(auth);

            onAuthStateChanged(auth, async (user) => {
                if (user) {
                    await setDoc(doc(db, "users", user.uid), {
                        role:"viewer",
                        name:username,         
                    })
                    window.location.reload(false);
                }
            })

        }
        else {
            codeRef.current.value = ""
            nameRef.current.value = ""
            setError(true)
        }
    }

    return (
        <div className="w-screen h-screen overflow-x-hidden p-[1.6rem] flex justify-center items-center relative bg-black">

            <div className="bg-glass w-full h-full rounded-[0.8rem] flex flex-col justify-center items-center">

                <RxCube className="text-white text-[12.8rem]" strokeWidth={1}/>
            
                <div className="flex flex-col">

                    <form onSubmit={handleAccess} className="w-[28rem] flex flex-col mt-[2.4rem]">

                        <input ref={nameRef} type="text" placeholder="name" className="px-[1.2rem] py-[0.8rem] rounded-[0.4rem] bg-transparent border-2 border-solid text-white text-[1.6rem] border-[#4c9671]"/>

                        <input ref={codeRef} type="password" placeholder="access code" className="px-[1.2rem] py-[0.8rem] rounded-[0.4rem] text-white text-[1.6rem] mt-[0.8rem] bg-transparent border-solid border-2" style={{borderColor: (error) ? "rgb(248,113,113)" : "#4c9671"}}/>

                        {error && <label className="text-[1.6rem] mt-[0.4rem] text-red-400">wrong access code</label>}

                        <button type="submit" className="flex justify-center items-center py-[0.8rem] rounded-[0.4rem] bg-[#4c9671] text-[1.6rem] text-white font-bold w-full mt-[0.8rem]">SUBMIT</button>

                    </form>

                    <button type="button" className="flex items-center text-white mt-[1.2rem] text-[1.2rem] underline underline-offset-2 group">admin login <BsArrowRight className="ml-[0.8rem] group-hover:translate-x-[0.4rem] transition-all duration-[0.6s]"/></button>
                </div>

            </div>

            <div className="absolute text-[1.2rem] text-white left-[3.2rem] bottom-[3.2rem]">Made With 💚 by Warren Wu</div>

        </div>
    )
}