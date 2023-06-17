import React from "react";
import Admin from "./admin";
import Blackbox from "./blackbox/blackbox";
import Access from "./access";
import { BrowserRouter, Routes, Route} from "react-router-dom"
import { useState } from "react"

export default function App() {

  return (
      <>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Access/>}></Route>
            <Route path="/blackbox" element={<Blackbox/>}></Route>
            <Route path="/admin" element={<Admin/>}></Route>
          </Routes>
        </BrowserRouter>
      </>
  );
}

