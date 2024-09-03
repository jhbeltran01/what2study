import React from "react"
import { NavLink } from "react-router-dom"

const NavBar = () => {
  return (
    <div>
      <NavLink to=''>Page1</NavLink>
      <NavLink to='page2'>Page2</NavLink>
      <NavLink to='page3'>Page3</NavLink>
    </div>
  )
}

export default NavBar