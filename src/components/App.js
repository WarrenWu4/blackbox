import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route} from "react-router-dom"
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import Blackbox from "./blackbox";
import Access from "./access";

export default function App() {

  const [isVerifying, setIsVerifying] = useState(true);
  const [mainRoute, setMainRoute] = useState(<Access/>)

  useEffect(() => {

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userInfo = await getDoc(doc(db, "users", user.uid))
        if (userInfo.exists()) {
          setMainRoute(<Blackbox role={userInfo.data()["role"]} name={userInfo.data()["name"]} />)
        }
      }
      setIsVerifying(false);
    })

  }, [])

  return (
      <>
        {!isVerifying && 
        <BrowserRouter>

          <Routes>

            <Route path="/" element={mainRoute}/>

            <Route path="*" element={<Error/>} />

          </Routes>

        </BrowserRouter>
        }
      </>
  );
}

const Error = () => {
  return (
    <div className="w-screen h-screen overflow-hidden bg-black text-white flex flex-col justify-center items-center">

      <span className="text-[4rem] font-semibold">Error 404:</span>
      <span className="text-[2.8rem] mt-[1.6rem] font-medium">Page Not Found</span>

    </div>
  )
}
