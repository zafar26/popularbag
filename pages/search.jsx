import { useForm } from "react-hook-form"
import {
    useQuery,
    useQueryClient,
  } from '@tanstack/react-query'
import { useEffect, useState } from "react";
import Link from "next/link";

function useBooks() {
    return useQuery({
        queryKey: ['books'],
        queryFn: async () => {
            try {
                const response = await fetch("/api/books/published", {
                  method: "GET", 
                  headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("token")
                  },
                });
            
                let result = await response.json(); 
                if(result.error){
                    return {error:true}
                }
                return result.books

              } catch (error) {
                // console.error("Error:", error);
                return {error}
              }
        },
    })
}
async function getBooks(pageno){
    try {
        const response = await fetch("/api/books/published?page="+pageno, {
          method: "GET", 
          headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem("token")
          },
        });
    
        let result = await response.json(); 
        if(result.error){
            return {error:true}
        }
        return result.books

      } catch (error) {
        // console.error("Error:", error);
        return false
      }
}

const Search= ()=> {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
      } = useForm()
    
    const queryClient = useQueryClient()
    const { status, data, error, isFetching } = useBooks()
    const [books, setBooks] = useState(data?data:[])
    const [page, setPage] = useState(1)
    useEffect(()=>{
        if(data && data.length>0){
            setBooks(data)
        }
    },[data])
    useEffect(()=>{
        let new_books = getBooks(page)
        if(new_books && new_books.length > 1){
            setBooks(new_books)
        }
    },[page])
    
    const onSearch = async() => {
        const data = await searchBooks(watch("searchValue"))
        if(data){
            setBooks(data.data)
        }
    }
    async function searchBooks(searchValue) {
        try {
            const response = await fetch("/api/books/search?searchTitle="+searchValue, {
                method: "GET", 
                headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
                },
            });
        
            let result = await response.json(); 
            if(result.error){
                return {error:true}
            }
            return {data:result.books}

        } catch (error) {
            // console.error("Error:", error);
            return { error }
        }
    }

    return (<div className="w-full h-screen p-2 bg-gray-200 flex flex-col items-center">
                <Link href={"/"} className='m-2 absolute right-0 top-0 h-18 bg-green-700 p-2 rounded shadow text-white '>Home</Link>

        <div className="md:w-1/2  h-full flex flex-col justify-start items-center bg-green-200 rounded shadow text-green-900">
            <h3 className="flex justify-center text-3xl font-semibold mt-4 ">Search a book</h3>
            <div className="flex  justify-center items-end w-full px-4">
                <div className="p-2">
                    <input className="px-4 py-2 w-full rounded shadow" placeholder="Search a Book" {...register("searchValue",{ required: true })}/>
                </div>
                
                <div className="p-2 mt-2">
                    <button className="px-4 py-2 w-full bg-green-800 rounded shadow text-white"onClick={onSearch}>Search</button>
                </div>
            </div>
            <div className="overflow-auto w-full h-full px-8 py-2">
                {/* All Books */}
                {status === 'pending' ? 
                    <span>Loading......</span> 
                    :   status === 'error' ? 
                            <span>Error: {error.message}</span>
                        :
                        //Data
                            books.map(d=> 
                                <div className="w-full  bg-gray-100 p-4" key={d._id}>
                                    <div className="w-full h-24 bg-red-100 p-2 flex justify-between ">
                                        <div className="w-full flex flex-col">
                                            <span className="font-light">{d.author}</span>
                                            <span className="font-bold">{d.title}</span>
                                            <p className="px-2 ">
                                                {d.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>)
                        }
            </div>
            <div className=" flex justify-center">
                {page>1 &&<button className="mx-4" onClick={()=>setPage(page-1)}>Prev</button>}
                {books.length > 10 &&<button className="mx-4" onClick={()=> setPage(page+1)}>Next</button>}
            </div>
        </div>
        
    </div>)
}

export default Search;