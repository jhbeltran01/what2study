import React from "react"
import { Link, Outlet } from "react-router-dom"

const Page3 = () => {
  return (
    <div>
      <h1>Hello Page3</h1>
      
      <nav>
        <Link to='page4'>Page 4</Link>
        <Link to='page5'>Page 5</Link>
      </nav>
      <Outlet />
    </div>
  )
}

export default Page3