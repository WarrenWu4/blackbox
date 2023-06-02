import React from 'react'
import { db } from "../../firebase"
import { collection, addDoc } from "firebase/firestore";

export default function AddFolder() {
  
    async function handleSubmit(e) {
        e.preventDefault()

        try {
            await addDoc(collection(db, "test folder"), {
                name: "yikess"
                // path:  ,
            })
        } catch (e) {
            console.log("error: ", e);
        }

    }
  
    return (
    <>
        <form onSubmit={handleSubmit}>
            <label>folder name: </label>
            <input type='text'></input>
            <button>add folder</button>
        </form>
    </>
  )
}
