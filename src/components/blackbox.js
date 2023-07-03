import React, { useEffect, useRef, useState } from "react"
import { Modal, Popover } from "@mui/material";
import { db } from "../firebase";
import { getDocs, collection, deleteDoc, doc, Timestamp, addDoc } from "firebase/firestore";

import { BsThreeDotsVertical, BsFileEarmarkPlay } from "react-icons/bs";
import { IoMdAddCircleOutline } from "react-icons/io";
import { HiOutlineHome, HiSortAscending } from "react-icons/hi";

export default function Blackbox({role, name}) {

    const [isLoadingData, setIsLoadingData] = useState(true);
    const [data, setData] = useState()

    useEffect(() => {

        const getData = async () => {
            const querySnapshot = await getDocs(collection(db, "data"));
            setData(querySnapshot);
            setIsLoadingData(false);
        }

        getData()

    }, [data])

    return (
        <>
            {!isLoadingData && <div className="w-screen min-h-screen flex flex-col items-center px-[3.2rem] py-[4rem] bg-black overflow-x-hidden">
                
                <span className="text-white text-[2.4rem] font-bold flex items-center mb-[4rem]">Hello&nbsp;<span className="text-[#4c9671] text-center">{name}</span> <img src="./default.png" alt="default_logo" className="w-[4.8rem] aspect-square ml-[1.2rem] rounded-[0.8rem] bg-glass p-[0.8rem]"/></span>

                {data.docs.map((doc) =>
                    <FileCard key={doc.id} docId={doc.id} name={doc.data()["name"]} fileType={doc.data()["type"]} source={doc.data()["source"]}/>
                )}

                {(role === "admin") && <Controls/>}

            </div>}
        </>
    )
}

const FileCard = ({name, fileType, source, docId}) => {

    const [menu, setMenu] = useState(false);
    const btnRef = useRef()
    const editItem = (e) => {
        e.preventDefault()
        console.log("WIP")
    }
    const deleteItem = async (e) => {
        e.preventDefault()
        await deleteDoc(doc(db, "data", docId))
        setMenu(false);
    }

    const handleClick = (e) => {
        e.preventDefault()
        setMenu(true);
    }

    return (
        <>
            <a href={source} target="_blank" className="max-w-[64rem] w-full h-[5.6rem] backdrop-blur-[2rem] rounded-[0.8rem] bg-glass flex justify-between items-center text-white px-[1.6rem] mb-[1.6rem]">

                <div className="text-[2rem] flex items-center">
                    <BsFileEarmarkPlay className="text-[2.4rem] mr-[0.8rem]"/>
                    <span className="flex overflow-hidden text-ellipsis whitespace-nowrap">{name}</span>
                </div>

                <button onClick={handleClick} ref={btnRef} type="button">
                    <BsThreeDotsVertical className="text-[2.4rem]"/>
                </button>
                <Popover
                    className="mt-[0.8rem]"
                    open={menu}
                    anchorEl={btnRef.current}
                    onClose={() => setMenu(false)}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                >
                    <div className="flex flex-col text-[1.2rem] text-black">
                        <button onClick={editItem} type="button" className="px-[1.6rem] py-[0.8rem] hover:bg-black/20 transition-all duration-[0.6s]">Edit</button>
                        <button onClick={deleteItem} type="button" className="px-[1.6rem] py-[0.8rem] hover:bg-black/20 transition-all duration-[0.6s]">Delete</button>
                    </div>
                </Popover>

            </a>

        </>
    )
}

const Controls = () => {

    const fileName = useRef()
    const fileType = useRef()
    const fileSource = useRef()
    const [modal, setModal] = useState(false);

    const scrollTop = () => {
        window.scrollTo({top:0, behavior: 'smooth'})
    }

    const sortFiles = () => {
        console.log("WIP")
    }

    const addFile = async (e) => {
        e.preventDefault()
        const fName = fileName.current.value
        const fType = fileType.current.value
        const fSource = fileSource.current.value

        await addDoc(collection(db, "data"), {
            name: fName,
            source: fSource,
            type: fType,
            created: Timestamp.now(),
        })

        fileName.current.value = ""
        fileType.current.value = "" 
        fileSource.current.value = ""
        setModal(false)
    }

    return (
        <>
        <div className="fixed bottom-0 h-[13.6rem] w-full bg-black flex items-center justify-center">

            <div className="fixed bottom-[4rem] bg-glass flex items-center justify-evenly text-white w-[16rem] h-[5.6rem] rounded-[0.8rem] backdrop-blur-[2rem]">

                <button onClick={scrollTop} type="button"><HiOutlineHome className="text-[2.4rem]"/></button>

                <button onClick={() => setModal(true)} type="button"><IoMdAddCircleOutline className="text-[2.4rem]"/></button>

                <button onClick={sortFiles} type="button"><HiSortAscending className="text-[2.4rem]"/></button>

            </div>

        </div>

        <Modal
            open={modal}
            onClose={() => setModal(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            >
                <form onSubmit={addFile} className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] p-[1.6rem] bg-glass flex text-white rounded-[0.8rem] backdrop-blur-[2rem] flex-col">
                
                    <label className="text-[2rem] font-bold">Name</label>
                    <input ref={fileName} type="text" className="rounded-[0.4rem] bg-white mt-[0.4rem] text-[1.6rem] text-black px-[0.8rem] py-[0.4rem]" required/>

                    <label className="text-[2rem] font-bold mt-[1.6rem]">File Type</label>
                    <select ref={fileType} className="text-[1.6rem] px-[0.8rem] py-[0.4rem] text-black bg-white rounded-[0.4rem] mt-[0.4rem]" required>
                        <option value="pdf">PDF</option>
                        <option value="doc">DOC</option>
                        <option value="vid">VID</option>
                    </select>

                    <label className="text-[2rem] font-bold mt-[1.6rem]">Source</label>
                    <div className="flex items-center justify-center mt-[0.4rem]">
                        <input ref={fileSource} type="text" className="mr-[0.8rem] text-[1.6rem] w-3/4 px-[0.8rem] py-[0.4rem] rounded-[0.4rem] bg-white text-black" />
                        <input type="file" className="ml-[0.8rem] text-[1.6rem] w-1/4 px-[0.8rem] py-[0.4rem] rounded-[0.4rem] bg-white text-black appearance-none" />
                    </div>

                    <button type="submit" className="w-full rounded-[0.4rem] bg-black text-white font-bold text-[1.6rem] py-[0.8rem] mt-[2.8rem]">SUBMIT</button>

                </form>
            </Modal>
        </>
    )
}