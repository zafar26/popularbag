'use client'
import Link from 'next/link';
import { useRouter } from 'next/router'
import { useEffect,useState } from 'react';
import ClipLoader from "react-spinners/ClipLoader";

const List= ()=> {
    const router = useRouter()
    const[data, setData] = useState([])
    const [loader, setLoader] = useState(true)
    useEffect(()=>{
        if(data.length < 1){
            fetch(`/api/books/user`, {
                method: "GET", 
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("token")
                },
                })
                .then(r=>r.json())
                .then(r=>{
                    if(r.books.length >0){
                        setData(r.books)
                    }
                    setLoader(false)
                })
                .catch(err=>{console.log(err)
                    setLoader(false)
                })
        }
        
    })
    const unPublish = async(e) =>{
        setLoader(true)
        try {
            const response = await fetch(`${process.env.BASE_URL}api/books/unpublish/${e.target.id}`, {
              method: "PUT", 
              headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
              },
            });
        
            let result = await response.json(); 
            if(result.error){
                alert("Failed to Unpublish")
            }
            alert("Unpublished")
            setLoader(false)
            router.reload()
            
        } catch (error) {
            // console.error("Error:", error);
            setLoader(false)
            alert("Failed to Unpublish")
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
    return (
    
        <div className="w-full h-full p-2 bg-gray-200 flex justify-center bg-green-200 ">
            <div className="w-screen h-screen md:w-1/2">
        
          <Link href={"/"} className='m-2 absolute right-0 top-0 h-18 bg-green-700 p-2 rounded shadow text-white '>Home</Link>
        <div className=" h-full flex flex-col justify-start items-center self-center rounded shadow text-green-900">
            <h3 className="flex justify-center text-3xl font-semibold mt-2 md:mt-4">My Books</h3>
           
            <div className=" w-full  h-full md:px-8 px-2 py-2 overflow-auto bg-gray-100 rounded">
                {/* All Books */}
                    {
                            //Data
                            data && data.length > 0 ? data.map(d=>    
                                <div className={`w-full h-24 p-2 md:my-2 my-1 flex flex-col justify-between rounded shadow  ${d.is_published? "bg-green-100 text-green-900 ":" bg-red-100 text-red-900" } `} key={d._id}>
                                    <div className="w-full flex justify-between">
                                            <p className="font-light"><span className='font-light'>Author :</span> {d.author}</p>
                                            {
                                        d.is_published &&
                                            <div className="">
                                                <button className="bg-red-800 p-1 text-xs md:p-2  rounded shadow text-white" id={d._id} onClick={unPublish}>Un Publish</button>
                                            </div>
                                    }

                                    </div>
                                            <p className="font-bold"><span className='font-light'>Title :</span> {d.title}</p>
                                            <p className=""><span className='font-light'>Description :</span>{ d.description && d.description.length>22 ? d.description.slice(0,9)+"...":d.description }</p>
                                    
                                </div>
                            )
                            :
                            < p className='text-green-900 w-full h-full flex justify-center items-center'>No Books Found</p>
                    }  
            </div>
        </div>
        </div>
        
    </div>)
}

export default List;