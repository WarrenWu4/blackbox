import React from "react"
import { RxCube } from "react-icons/rx";
import { FaFileUpload, FaUpload } from "react-icons/fa";
import { ImArrowRight } from "react-icons/im";
import { useState, useRef, useEffect } from "react";
import { storage, db } from "../../firebase"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc, getDocs } from "firebase/firestore";
import File from "./file";

export default function Blackbox(props) {

    console.log(props.admin)

    const urlRef = useRef();
    const [file, setFile] = useState("");
    const [url, setUrl] = useState("")
    const [addFile, setAddFile] = useState(false);
    const [fileComponent, setFileComponent] = useState([]);

    // fetch data
    useEffect(() => {
        const fetchData = async () => {
            const data = await getDocs(collection(db, "uploads"));
            data.forEach((doc) => {
                console.log(doc.data().link, doc.data().name);
                const file = <File url={doc.data().link} name={doc.data().name}/>
                setFileComponent([file])
                console.log(fileComponent)
            })
        }

        fetchData().catch(console.error);

    }, [])

    const handleChange = (e) => {
        setFile(e.target.files[0]);
    }

    async function handleSubmit(e) {
        e.preventDefault();

        // if url store as string in firestore
        if (urlRef.current.value !== "") {
            console.log("will do this later since I'll need to change the jsx to include a name along with link")
        }
        // same with file upload except use uploadbytes to upload it in storage
        else if (file !== "") {
            const storageRef = ref(storage, file.name);
            await uploadBytesResumable(storageRef, file).then(console.log("uploading..."));
            await getDownloadURL(storageRef, file.name).then((url) => {
                console.log("url set to: ", url);
                setUrl(url);
                try{
                    addDoc(collection(db, "uploads"), {
                        name: file.name,
                        link: url,
                    })
                } catch(err) {
                    console.log("error: ", err)
                }
            });

        }

        // reset values
        setFile("");
        urlRef.current.value = "";
        setAddFile(false);
    }

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
                {fileComponent}
            </div>

            <div className="blackbox-upload-file" style={{display:(addFile)?"flex":"none"}}>
                <form className="blackbox-form" onSubmit={handleSubmit}>
                    <label className="blackbox-label">Upload File / URL</label>
                    <input type="url" className="blackbox-input-url" ref={urlRef}></input>
                    <div style={{display: "flex"}}>
                        <label className="blackbox-input-file">
                            <FaUpload/>
                            <input type="file" onChange={handleChange}></input>
                        </label>
                        <button className='blackbox-upload-btn' type='submit'>
                            <ImArrowRight/>
                        </button>
                    </div>
                </form>
            </div>

        </div>
    )
}