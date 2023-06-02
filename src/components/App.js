import React from "react";
import Admin from "./admin";
import Blackbox from "./blackbox/blackbox";
import { BrowserRouter, Routes, Route} from "react-router-dom"
import { useState } from "react"

export default function App() {
  
  const [admin, setAdmin] = useState(false)

  return (
      <>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Blackbox admin={admin}/>}></Route>
            <Route path="/blackbox" element={<Blackbox admin={admin}/>}></Route>
            <Route path="/admin" element={<Admin setPermission={setAdmin}/>}></Route>
          </Routes>
        </BrowserRouter>
      </>
  );
}

