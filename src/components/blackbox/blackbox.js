import React, { useEffect, useState } from "react"
import { Modal } from "@mui/material";
import { db } from "../../firebase";
import { getDocs, collection } from "firebase/firestore";

import { BsThreeDotsVertical, BsFileEarmarkPlay } from "react-icons/bs";
import { IoMdAddCircleOutline } from "react-icons/io";
import { HiOutlineHome, HiSortAscending } from "react-icons/hi";

export default function Blackbox() {

    const [isLoadingData, setIsLoadingData] = useState(true);
    const [data, setData] = useState()

    useEffect(() => {

        const getData = async () => {
            const querySnapshot = await getDocs(collection(db, "data"));
            setData(querySnapshot);
            setIsLoadingData(false);
        }

        getData()

    }, [])

    return (
        <>
            {!isLoadingData && <div className="w-screen min-h-screen flex flex-col items-center px-[3.2rem] py-[4rem] bg-black overflow-x-hidden">
                
                {data.docs.map((doc) =>
                    <FileCard key={doc.id} name={doc.data()["name"]} fileType={doc.data()["type"]} source={doc.data()["source"]}/>
                )}

                <Controls/>

            </div>}
        </>
    )
}

const FileCard = ({name, fileType, source}) => {

    const handleClick = () => {
        console.log("WIP")
    }

    return (
        <a href={source} target="_blank" className="max-w-[64rem] w-full h-[5.6rem] backdrop-blur-[2rem] rounded-[0.8rem] bg-glass flex justify-between items-center text-white px-[2.4rem] mb-[1.6rem]">

            <div className="text-[2rem] font-semibold flex items-center">
                <BsFileEarmarkPlay className="text-[2rem] mr-[0.8rem]"/>
                <span className="flex text-[2rem] overflow-hidden text-ellipsis whitespace-nowrap">{name}</span>
            </div>

            <button onClick={handleClick} type="button">
                <BsThreeDotsVertical className="text-[2rem]"/>
            </button>

        </a>
    )
}

const Controls = () => {

    const [modal, setModal] = useState(false);

    const scrollTop = () => {
        window.scrollTo({top:0, behavior: 'smooth'})
    }

    const sortFiles = () => {
        console.log("WIP")
    }

    const addFile = () => {
        console.log("WIP")
        // --> carry out the operation on the backend -> reflect changes on frontend manually for better speeds
    }

    return (
        <>
        <div className="fixed bottom-0 h-[13.6rem] w-full bg-black flex items-center justify-center">

            <div className="fixed bottom-[4rem] bg-glass flex items-center justify-evenly text-white w-[19.2rem] h-[5.6rem] rounded-[0.8rem] backdrop-blur-[2rem]">

                <button onClick={scrollTop} type="button"><HiOutlineHome className="text-[3.2rem]"/></button>

                <button onClick={() => setModal(true)} type="button"><IoMdAddCircleOutline className="text-[3.2rem]"/></button>

                <button onClick={sortFiles} type="button"><HiSortAscending className="text-[3.2rem]"/></button>

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
                    <input type="text" className="rounded-[0.4rem] bg-white mt-[0.4rem] text-[1.6rem] text-black px-[0.8rem] py-[0.4rem]" required/>

                    <label className="text-[2rem] font-bold mt-[1.6rem]">File Type</label>
                    <select className="text-[1.6rem] px-[0.8rem] py-[0.4rem] text-black bg-white rounded-[0.4rem] mt-[0.4rem]" required>
                        <option value="pdf">PDF</option>
                        <option value="doc">DOC</option>
                        <option value="vid">VID</option>
                    </select>

                    <label className="text-[2rem] font-bold mt-[1.6rem]">Source</label>
                    <div className="flex items-center justify-center mt-[0.4rem]">
                        <input type="text" className="mr-[0.8rem] text-[1.6rem] w-3/4 px-[0.8rem] py-[0.4rem] rounded-[0.4rem] bg-white text-black" />
                        <input type="file" className="ml-[0.8rem] text-[1.6rem] w-1/4 px-[0.8rem] py-[0.4rem] rounded-[0.4rem] bg-white text-black appearance-none" />
                    </div>

                    <button type="submit" className="w-full rounded-[0.4rem] bg-black text-white font-bold text-[1.6rem] py-[0.8rem] mt-[2.8rem]">SUBMIT</button>

                </form>
            </Modal>
        </>
    )
}