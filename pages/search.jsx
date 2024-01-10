'use client'
import { useForm } from "react-hook-form"
import { useEffect, useState } from "react";
import Link from "next/link";
import ClipLoader from "react-spinners/ClipLoader";

const Search= ()=> {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
      } = useForm()
    const [books, setBooks] = useState([])
    const [page, setPage] = useState(1)
    const [loader, setLoader] = useState(true)

    // useEffect(()=>{
    //     if(books.length <1){
    //         fetch(`${process.env.BASE_URL}api/books/published`, {
    //             method: "GET", 
    //             headers: {
    //             "Content-Type": "application/json",
    //             "Authorization": localStorage.getItem("token")
    //           },
    //         })
    //         .then((response)=>response.json())
    //         .then((result)=> {
    //             if(result.books && result.books.length > 0){
    //                 setBooks(result.books)
    //             }
    //             setLoader(false)
    //         })
    //         .catch((err)=>{
    //             console.log(err)
    //             setLoader(false)
    //         })        
    //     }
    // })
    useEffect(()=>{
        setLoader(true)
        fetch(`${process.env.BASE_URL}api/books/published?page=${page}`, {
            method: "GET", 
            headers: {
              "Content-Type": "application/json",
              "Authorization": localStorage.getItem("token")
            },
          })
          .then((response)=>response.json())
          .then((result)=> {
            if(result.books ){
                setBooks(result.books)
            }
            setLoader(false)
          })
          .catch((err)=>{
            console.log(err)
            setLoader(false)
        
        })            
    },[page])
    
    const onSearch = () => searchBooks(watch("searchValue"))
        
    async function searchBooks(searchValue) {
        setLoader(true)        
        try {
            const response = await fetch(`${process.env.BASE_URL}api/books/search?searchTitle=${searchValue}`, {
                method: "GET", 
                headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
                },
            });
        
            let result = await response.json(); 
            if(result.books && result.books.length>0){
                setBooks(result.books)
            }else{
                alert("No Book Found")
                
            }
            setLoader(false)

        } catch (error) {
            setLoader(false)
            console.error("Error:", error);
        }
    }
    if(loader){    
        return <div className='w-screen h-screen bg-white flex justify-center items-center'>
            <ClipLoader
                color={"#4F6F52"}
                loading={loader}
                size={90}
                aria-label="Loading Spinner"
                data-testid="loader"
            />
            </div>
    }
    return (<div className="w-full h-screen p-2 bg-gray-200 flex flex-col items-center bg-green-200">
                <Link href={"/"} className='m-2 absolute right-0 top-0 h-18 bg-green-700 p-2 rounded shadow text-white '>Home</Link>

        <div className="md:w-1/2 w-full h-full flex flex-col justify-start items-center  rounded shadow text-green-900">
            <h3 className="flex justify-center text-3xl font-semibold mt-4 mr-8 md:mr-0">Search a book</h3>
            <div className="flex justify-center items-end w-full ">
                <div className="p-2">
                    <input className="px-4 py-2 w-full rounded shadow" placeholder="Search a Book" {...register("searchValue",{ required: true })}/>
                </div>
                
                <div className="p-2 mt-2">
                    <button className="px-4 py-2 w-full bg-green-800 rounded shadow text-white"onClick={onSearch}>Search</button>
                </div>
            </div>
            <div className="overflow-auto w-full h-full md:px-8 px-2 py-2 rounded">
                {/* All Books */}
                {
                        books && books.length>0 ? books.map(d=> 
                                <div className="w-full  bg-gray-100 md:p-4 p-2" key={d._id}>
                                    <div className="w-full h-24 bg-green-100 text-green-900 p-2 flex justify-between rounded shadow">
                                        <div className="w-full flex flex-col">
                                            <span className="font-light">Author: {d.author}</span>
                                            <span className="font-bold">Title: {d.title}</span>
                                            <p className=" ">Description: { d.description && d.description.length>22 ? d.description.slice(0,9)+"...":d.description }</p>
                                        </div>
                                    </div>
                                </div>)
                                :
                                < p className='text-green-900 bg-gray-100 w-full h-full flex justify-center items-center'>No Books Found</p>

                        }
            </div>
            <div className=" flex justify-center">
                {page>1 &&<button className="mx-4" onClick={()=>setPage(page-1)}>Prev</button>}
                {books.length >= 10 &&<button className="mx-4" onClick={()=> setPage(page+1)}>Next</button>}
            </div>
        </div>
        
    </div>)
}

export default Search;