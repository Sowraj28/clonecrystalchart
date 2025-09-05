import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <>
     <footer className="bg-light-dark text-center text-lg-start text-white" style={{ marginTop: "auto" }}>
       <div className="text-center text-dark p-3" style={{ color: "rgba(0, 0, 0, 0.2)" }}>
         © 2025 Copyright ,
         <Link className=" text-dark ml-2" to="/">
           Crystal Chart
         </Link>
       </div>
     </footer>
    </>
  )
}

export default Footer