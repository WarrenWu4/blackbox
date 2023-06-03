import React from "react"
import { RxCube } from "react-icons/rx";
import { FaFileUpload, FaUpload } from "react-icons/fa";
import { ImArrowRight } from "react-icons/im";
import { useState, useRef, useEffect } from "react";
import { storage, db } from "../../firebase"
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { collection, addDoc, getDocs, getDoc, doc, deleteDoc } from "firebase/firestore";
import File from "./file";

export default function Blackbox(props) {

    // references to get input values
    const urlRef = useRef();
    const nameRef = useRef();

    // store modal display state for upload
    const [addFile, setAddFile] = useState(false);
    // store file on change for input
    const [inFile, setInFile] = useState("")
    // store file components
    const [uploads, setUploads] = useState([])
    // store the id of component that's going to be deleted
    const [delId, setDelId] = useState("");
    // store modal display state for delete
    const [addDel, setAddDel] = useState(false);

    // takes in file name, link, and type and stores it in firestore as well as storage if from "uploads" section
    const uploadData = async (e) => {
        e.preventDefault()
        // uploading requires admin perms
        if (props.admin) {
            // if there's a url --> store in firestore
            if(urlRef.current.value !== "" && nameRef.current.value !== "") {
                console.log("UPLOADING LINKS......\n")
                try {
                    await addDoc(collection(db, "data"), {
                        link: urlRef.current.value,
                        name: nameRef.current.value,
                        type: "link"
                    })
                } catch(err) {
                    console.log("LINK UPLOAD ERROR:\n", err)
                }
            }
            // if there's a file upload --> store in storage then store in firestore
            if(inFile !== "") {
                console.log("UPLOADING FILES......")
                await uploadBytesResumable(ref(storage, inFile.name), inFile);
                await getDownloadURL(ref(storage, inFile.name)).then((url) => {
                    try {
                        addDoc(collection(db, "data"), {
                            link: url,
                            name: inFile.name,
                            type: "file"
                        })
                    } catch(err) {
                        console.log("FILE UPLOAD ERROR:\n", err)
                    }
                })
            }
        }
        // reset parameters
        setInFile("");
        urlRef.current.value = "";
        nameRef.current.value = "";
        setAddFile(false);

    };

    // takes in an id and deletes it from firestore as well as storage if from "uploads" section
    const deleteData = async () => {
        //requires admin perms
        if (props.admin) {
            // get data from id
            const docu = await getDoc(doc(db, "data", delId))
            const type = docu.data().type;
            // if upload type is file --> delete from storage and firestore
            if (type === "file") { 
                console.log("DELETING FILE.....")
                // deleting from storage
                deleteObject(ref(storage, docu.data().name)).then(() => {
                    console.log("File deleted successfully")
                }).catch((err) => {
                    console.log("DELETING FILE ERROR:\n", err)
                })

                // delete from firestore
                await deleteDoc(doc(db, "data", delId));
            } 
            // otherwise just delete the upload link type from firestore
            else {
                console.log("DELETING LINK....")
                await deleteDoc(doc(db, "data", delId))
            }

            // close modal at end
            setAddDel(false);
        }
    }

    // fetches and displays data
    const readData = async () => {
        const data = await getDocs(collection(db, "data"));
        const fileComp = data.docs.map((doc) => {
            return <File url={doc.data().link} name={doc.data().name} id={doc.id} setId={setDelId} />
        })
        setUploads(fileComp);
    }

    // rerenders data on upload and delId
    useEffect(() => {

        readData()
    
    }, [addFile, addDel])

    //deletes data on delID change
    useEffect(() => {

        if (delId !== "") {
            setAddDel(true)
        }

    }, [delId])

    return (
        <div className="blackbox">
            <div className="blackbox-row">
                <div className="blackbox-logo">
                    <RxCube/>
                    blackbox
                </div>
                <div className="blackbox-about">about</div>
            </div>
            <div className="blackbox-info">
                <div className="blackbox-path">
                    Root/
                </div>
                {props.admin &&
                    <div className="blackbox-files" onClick={() => setAddFile(true)}>
                        <FaFileUpload/>
                    </div>
                }
            </div>
            <div className="blackbox-divider"></div>

            <div className="blackbox-content">
                {uploads}
            </div>

            {/* uploads form */}
            <div className="blackbox-upload-file" style={{display:(addFile)?"flex":"none"}}>

                <form className="blackbox-form" onSubmit={uploadData}>

                    <label className="blackbox-label">Upload File / URL</label>
                    <input type="text" className="blackbox-input-url" ref={nameRef} placeholder="name"></input>
                    <input type="url" className="blackbox-input-url" ref={urlRef} placeholder="link"></input>

                    <div style={{display: "flex"}}>

                        <label className="blackbox-input-file">
                            <FaUpload/>
                            <input type="file" onChange={(e) => setInFile(e.target.files[0])}></input>
                        </label>

                        <button className='blackbox-upload-btn' type='submit'>
                            <ImArrowRight/>
                        </button>

                    </div>

                </form>

            </div>

            {/* confirm delete */}
            <div className="blackbox-upload-file" style={{display:(addDel)?"flex":"none"}} onContextMenu={(e) => e.preventDefault()}>
                Are you sure you want to delete?
                <div className="blackbox-del-confirm">
                    <button className="blackbox-del-btn" onClick={() => setAddDel(false)}>NO!</button>
                    <button className="blackbox-del-btn" onClick={deleteData}>YES</button>
                </div>
            </div>

        </div>
    )
}