"use client"
import Link from 'next/link'
import { useEffect, useState } from 'react'


export default function Home() {
  const [ token, setToken] = useState("")
  useEffect(()=>{
    setToken(localStorage.getItem("token"))
  },[])
  return (
    <main
      className="flex w-screen h-screen items-center justify-center "
    >
      <div>
        <span className='flex justify-center text-3xl'> Welcome ! </span>
        <div className='flex flex-col md:flex-row mt-4'>
          {token?            
          <>
            </>
          : <>
          <Link href={"/signup"} className='m-2  h-18 bg-green-700 p-2 rounded shadow text-white '>Signup</Link>
          <Link href={"/login"} className='m-2 h-18 bg-green-700 p-2 rounded shadow text-white '>Login</Link>
            <Link href={"/search"} className='m-2  h-18 bg-green-700 p-2 rounded shadow text-white '>Search a Book</Link>
            <Link href={"/publish"} className='m-2  h-18 bg-green-700 p-2 rounded shadow text-white '>Publish a Book</Link>
            <Link href={"/list"} className='m-2  h-18 bg-green-700 p-2 rounded shadow text-white '>My Books</Link>
            <button className='m-2  h-18 bg-green-700 p-2 rounded shadow text-white ' onClick={()=>{localStorage.removeItem("token"); alert("Loged out")}}>Log Out</button>
          
          </>}
        </div>
      </div>
    </main>
  )
}
